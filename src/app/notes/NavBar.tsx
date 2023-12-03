"use client"

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png"
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddNoteDialog from "@/components/AddEditNoteDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes";
import ChatButton from "@/components/ChatButton";

export default function NavBar() {

    const { theme } = useTheme()

    const [showAddEditNote, setShowAddEditNote] = useState(false)

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
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                baseTheme: (theme === "dark" ? dark : undefined),
                                elements: { avatarBox: { width: "2.5", height: "2.5" } }
                            }}

                        />

                        <ThemeToggleButton />

                        <Button onClick={() => { setShowAddEditNote(true) }}>
                            <Plus size={20} className="mr-2" />
                            New Note
                        </Button>
                        <ChatButton />
                    </div>
                </div>
            </div>
            <AddNoteDialog open={showAddEditNote} setOpen={setShowAddEditNote} />
        </>
    )
}