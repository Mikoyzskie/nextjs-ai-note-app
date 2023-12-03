"use client"

import { useState } from "react";
import AIChatBot from "./AIChatBot";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";

export default function ChatButton() {
    const [chatBoxOpen, setChatBoxOpen] = useState(false)

    return (
        <>
            <Button onClick={() => { setChatBoxOpen(true) }}>
                <Bot
                    size={20}
                    className="mr-3"
                />
                AI Chat
            </Button>
            <AIChatBot open={chatBoxOpen} onClose={() => { setChatBoxOpen(false) }} />
        </>
    )
}