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
      <div className="flex flex-col w-full max-w-2xl p-4 mx-auto rounded-xl space-y-4 items-center">
        {messages.map((m, i) => (
          <div
            className={`flex flex-row w-full ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              key={i}
              className={`whitespace-pre-wrap rounded-xl max-w-lg ${
                m.role === "user" ? "bg-user" : "bg-ai"
              } p-4`}
            >
              {m.content as string}
            </div>
          </div>
        ))}
        <div className="w-full">
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
            onSubmit={() => {
              const newMessages: CoreMessage[] = [
                ...messages,
                { content: input, role: "user" },
              ];

              setMessages(newMessages);
            }}
          >
            <Input
              className="w-full border border-gray-300 rounded-xl shadow-xl"
              value={input}
              placeholder="Say something..."
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
        </div>
      </div>
    </main>
  );
}
