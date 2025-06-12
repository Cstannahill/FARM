import { useState, useCallback, useRef } from "react";
import type {
  ChatMessage,
  UseChatReturn,
  SendMessageOptions,
} from "@/types/chat";

// Generate unique IDs for messages
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// System prompt for FARM Framework assistant
const SYSTEM_PROMPT = `You are a helpful AI assistant specializing in FARM Framework documentation and development. 

FARM Framework is a modern full-stack platform combining FastAPI (Python), React (TypeScript), and MongoDB with automatic type generation (Type-Sync).

Key areas you help with:
- Installation and setup guides
- Project structure and configuration
- Type-Sync automatic code generation
- Component development patterns
- API integration with React Query
- Database modeling and operations
- Deployment and production best practices

Always provide:
- Clear, actionable guidance
- Code examples when relevant
- Links to documentation when appropriate
- Step-by-step instructions for complex tasks

Format your responses using Markdown for better readability. Be concise but comprehensive.`;

// Function to call the Vercel serverless function
async function callChatAPI(
  messages: Array<{ role: string; content: string }>,
  systemPrompt = SYSTEM_PROMPT
): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "OpenAI API error");
    }

    return (
      data.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response."
    );
  } catch (error) {
    console.error("Chat API Error:", error);
    throw error;
  }
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string, options?: SendMessageOptions) => {
      if (isLoading) return;

      setIsLoading(true);
      setError(null);

      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Add user message
      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        // Prepare conversation history for API
        const conversationMessages = [...messages, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        // Add context to the system prompt if provided
        let contextualSystemPrompt = SYSTEM_PROMPT;
        if (options?.context?.currentPage) {
          contextualSystemPrompt += `\n\nCurrent page context: ${options.context.currentPage}`;
        }
        if (options?.context?.selectedText) {
          contextualSystemPrompt += `\n\nSelected text: ${options.context.selectedText}`;
        }
        if (options?.context?.documentationContext) {
          contextualSystemPrompt += `\n\nDocumentation context: ${options.context.documentationContext}`;
        }

        // Create assistant message placeholder
        const assistantMessageId = generateId();
        const assistantMessage: ChatMessage = {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
          isStreaming: true,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Call the OpenAI API through our Vercel function
        const response = await callChatAPI(
          conversationMessages,
          contextualSystemPrompt
        );

        // Update the assistant message with the complete response
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: response,
                  isStreaming: false,
                }
              : msg
          )
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while communicating with the AI assistant.";
        setError(errorMessage);

        // Remove the failed assistant message placeholder
        setMessages((prev) => prev.slice(0, -1));

        console.error("Chat error:", err);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [isLoading, messages]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const regenerateLastMessage = useCallback(async () => {
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");
    if (!lastUserMessage) return;

    // Remove the last assistant message
    setMessages((prev) => {
      const lastAssistantIndex = prev
        .map((m) => m.role)
        .lastIndexOf("assistant");
      if (lastAssistantIndex === -1) return prev;
      return prev.slice(0, lastAssistantIndex);
    });

    // Resend the last user message
    await sendMessage(lastUserMessage.content);
  }, [messages, sendMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    regenerateLastMessage,
  };
}
