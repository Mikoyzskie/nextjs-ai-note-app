import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { createNoteSchema, deleteNoteSchema, updateNoteSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request){
    try {
        const body = await req.json();

        //check request from createNoteSchema
        //safeParse for customized error message
        const parseResult = createNoteSchema.safeParse(body);

        if(!parseResult.success){
            console.error(parseResult.error);
            return Response.json({error: "Invalid Input"},{status: 400});
        }

        const {title, content} = parseResult.data

        const {userId} = auth()


        //check if the user exists
        if(!userId){
            return Response.json({error: "Unauthorized"},{status: 401});
        }

        //create a new vector embedding
        const embedding = await getEmbeddingForNote(title, content)

        //creating transaction for multiple databases operations
        const note = await prisma.$transaction(async (tx) => {
            //create a new note
            const note = await tx.note.create({
                data:{
                    title,
                    content,
                    userId
                }
            })

            //create an entry for the pinecone
            //must be done after the prisma transaction
            await notesIndex.upsert([
                {
                    id: note.id,
                    values: embedding,
                    metadata: {userId}
                }
            ])

            return note
        })

        return Response.json({note},{status: 201})
    } catch (error) {
        console.error(error);
        return Response.json({error: "Internal Server Error"},{status: 500});
    }
}

export async function PUT(req: Request){
    try {
        
        const body = await req.json();

        const parseResult = updateNoteSchema.safeParse(body);

        if(!parseResult.success){
            console.error(parseResult.error);
            return Response.json({error: "Invalid Input"},{status: 400});
        }

        const { id, title, content} = parseResult.data

        const note = await prisma.note.findUnique({where: {id}})

        if(!note) {
            return Response.json({error: "Note not found"},{status: 404});
        }

        const {userId} = auth()

        if(!userId || userId !== note.userId) {
            return Response.json({error: "Unauthorized"},{status: 401});
        }

        const embedding = await getEmbeddingForNote(title, content)

        const updatedNote = await prisma.$transaction(async (tx)=>{
            const updatedNote = await tx.note.update({
            where: {id},
                data:{
                    title,
                    content
                }
            })

            await notesIndex.upsert([
                {
                    id,
                    values: embedding,
                    metadata: {userId}
                }
            ])

            return updatedNote
        })

        

        return Response.json({updatedNote},{status: 200});

    } catch (error) {
        console.error(error);
        return Response.json({error: "Internal Server Error"},{status: 500})
    }
}


export async function DELETE(req: Request){
    try {
        
        const body = await req.json();

        const parseResult = deleteNoteSchema.safeParse(body);

        if(!parseResult.success){
            console.error(parseResult.error);
            return Response.json({error: "Invalid Input"},{status: 400});
        }

        const { id } = parseResult.data

        const note = await prisma.note.findUnique({where: {id}})

        if(!note) {
            return Response.json({error: "Note not found"},{status: 404});
        }

        const {userId} = auth()

        if(!userId || userId !== note.userId) {
            return Response.json({error: "Unauthorized"},{status: 401});
        }

        await prisma.$transaction(async (tx)=>{
            await tx.note.delete({where: {id}})
            await notesIndex.deleteOne(id)
        })

        return Response.json({message: "Note deleted"},{status: 200});

    } catch (error) {
        console.error(error);
        return Response.json({error: "Internal Server Error"},{status: 500})
    }
}



async function getEmbeddingForNote(title: string, content: string|undefined){
    return getEmbedding(title + "\n\n" + content ?? "")
}