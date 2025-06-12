// Types for OpenAI Assistant chat functionality
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StreamingResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason?: string | null;
  }>;
}

export interface ChatContextData {
  currentPage?: string;
  selectedText?: string;
  documentationContext?: string;
}

export interface SendMessageOptions {
  context?: ChatContextData;
  stream?: boolean;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, options?: SendMessageOptions) => Promise<void>;
  clearChat: () => void;
  regenerateLastMessage: () => Promise<void>;
}
