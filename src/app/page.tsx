import Image from 'next/image'
import logo from "@/assets/logo.png"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default function Home() {

  // if user already logged in

  const { userId } = auth()

  if (userId) redirect("/notes")

  return (
    <main className='flex flex-col h-screen items-center justify-center gap-5'>
      <div className='flex items-center gap-4'>
        <Image
          src={logo}
          alt='Noted Po Logo'
          height={100}
          width={100}
        />
        <span className='font-extrabold tracking-tight text-4xl lg:text-5xl'>NotedPo</span>
      </div>
      <p className='text-center max-w-prose'>
        Welcome to our advanced note-taking app! Powered by NextJS, OpenAI, Prisma, MongoDB, Pinecone, and Clerk, it{"'"}s a seamless blend of cutting-edge tech.
      </p>
      <Button size={"lg"} asChild>
        <Link href={"/"}>Open</Link>
      </Button>
    </main>
  )
}
