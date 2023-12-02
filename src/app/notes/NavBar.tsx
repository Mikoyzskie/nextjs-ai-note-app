"use client"

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png"
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddNoteDialog from "@/components/AddNoteDialog";


export default function NavBar() {

    const [showAddNote, setShowAddNote] = useState(false)

    return (
        <>
            <div className="p-4 shadow ">
                <div className="m-auto flex flex-wrap gap-3 items-center justify-between max-w-7xl">
                    <Link href={"/notes"} className="flex items-center gap-2">
                        <Image
                            src={logo}
                            alt="Noted Po Logo"
                            width={40}
                            height={40}
                        />
                        <span className="font-bold">Noted Po</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <UserButton afterSignOutUrl="/" appearance={{
                            elements: { avatarBox: { width: "2.5", height: "2.5" } }
                        }} />
                        <Button onClick={() => { setShowAddNote(true) }}>
                            <Plus size={20} className="mr-2" />
                            New Note
                        </Button>
                    </div>
                </div>
            </div>
            <AddNoteDialog open={showAddNote} setOpen={setShowAddNote} />
        </>
    )
}