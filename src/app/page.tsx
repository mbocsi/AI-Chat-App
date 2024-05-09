"use client";

import { type CoreMessage } from "ai";
import { useState } from "react";
import { continueConversation } from "./actions";
import { readStreamableValue } from "ai/rsc";
import { ModeToggle } from "@/components/mode-toggle";
import { Input } from "@/components/ui/input";

export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState("");
  return (
    <main className="min-h-screen w-full flex flex-col items-center space-y-4">
      <div className="w-full py-1 px-4 flex flex-row justify-end">
        <ModeToggle />
      </div>
      <div className="flex flex-col w-full max-w-xl p-4 mx-auto bg-secondary rounded-xl space-y-4">
        {messages.map((m, i) => (
          <div
            className={`flex flex-row justif ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div key={i} className="whitespace-pre-wrap rounded-xl bg-card p-4">
              {m.content as string}
            </div>
          </div>
        ))}

        <form
          action={async () => {
            const newMessages: CoreMessage[] = [
              ...messages,
              { content: input, role: "user" },
            ];

            setMessages(newMessages);
            setInput("");

            const result = await continueConversation(newMessages);

            for await (const content of readStreamableValue(result)) {
              setMessages([
                ...newMessages,
                {
                  role: "assistant",
                  content: content as string,
                },
              ]);
            }
          }}
        >
          <Input
            className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.target.value)}
          />
        </form>
      </div>
    </main>
  );
}
