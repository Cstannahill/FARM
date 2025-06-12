import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  User,
  Bot,
  X,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import type { ChatMessage, SendMessageOptions } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownViewer } from "./MarkdownViewer";

interface ChatMessageComponentProps {
  message: ChatMessage;
  onRegenerate?: () => void;
  isLast?: boolean;
}

function ChatMessageComponent({
  message,
  onRegenerate,
  isLast,
}: ChatMessageComponentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-3 p-4 group hover:bg-muted/30 transition-colors",
        message.role === "user" ? "bg-muted/20" : ""
      )}
    >
      <div className="flex-shrink-0">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            message.role === "user"
              ? "bg-blue-500 text-white"
              : "bg-green-500 text-white"
          )}
        >
          {message.role === "user" ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">
            {message.role === "user" ? "You" : "Assistant"}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="max-w-none">
          {message.isStreaming ? (
            <div className="flex items-center gap-2">
              <span className="whitespace-pre-wrap break-words">
                {message.content}
              </span>
              <div className="w-2 h-4 bg-green-500 animate-pulse rounded-sm" />
            </div>
          ) : message.role === "assistant" ? (
            <MarkdownViewer content={message.content} />
          ) : (
            <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap break-words">
              {message.content}
            </div>
          )}
        </div>

        {message.role === "assistant" && !message.isStreaming && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-xs"
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>

            {isLast && onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                className="h-7 px-2 text-xs"
              >
                <RotateCcw className="w-3 h-3" />
                Regenerate
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface ChatInputProps {
  onSendMessage: (message: string, options?: SendMessageOptions) => void;
  isLoading: boolean;
  placeholder?: string;
}

function ChatInput({
  onSendMessage,
  isLoading,
  placeholder = "Ask a question...",
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[40px] max-h-32 resize-none pr-12 text-sm"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="sm"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 bottom-2 h-8 w-8 p-0"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span>Powered by GPT-4</span>
      </div>
    </form>
  );
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, options?: SendMessageOptions) => void;
  onRegenerate?: () => void;
  onClearChat?: () => void;
  isLoading: boolean;
  error?: string | null;
  title?: string;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  onRegenerate,
  onClearChat,
  isLoading,
  error,
  title = "FARM Assistant",
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Enhanced auto-scroll functionality that works with ScrollArea
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (scrollAreaRef.current) {
      // Find the viewport element within the ScrollArea
      const viewport = scrollAreaRef.current.querySelector(
        '[data-slot="scroll-area-viewport"]'
      ) as HTMLElement;
      if (viewport) {
        setTimeout(() => {
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior,
          });
        }, 50); // Small delay to ensure content is rendered
      }
    }
  }, []);

  // Check if user has scrolled up and show scroll button
  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]'
    ) as HTMLElement;
    if (!viewport) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom && messages.length > 0);
    };

    viewport.addEventListener("scroll", handleScroll);
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [messages.length]);

  // Auto-scroll when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-scroll during streaming with more frequent updates
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.isStreaming) {
      // Use immediate scrolling for streaming to keep up with content
      const interval = setInterval(() => {
        scrollToBottom("auto");
      }, 100);
      return () => clearInterval(interval);
    }
  }, [messages, scrollToBottom]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">{title}</h2>
            <p className="text-xs text-muted-foreground">
              AI-powered documentation assistant
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearChat}
            className="h-8 px-2 text-xs"
          >
            Clear chat
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="flex flex-col pb-8">
          {/* Removed space-y-4, added bottom padding */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">Welcome to FARM Assistant</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                I'm here to help you with FARM Framework documentation, code
                examples, and best practices.
              </p>
              <div className="grid gap-2 w-full max-w-sm">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onSendMessage("How do I get started with FARM?")
                  }
                  className="justify-start h-8 text-xs"
                >
                  How do I get started with FARM?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSendMessage("What is Type-Sync?")}
                  className="justify-start h-8 text-xs"
                >
                  What is Type-Sync?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSendMessage("Show me a component example")}
                  className="justify-start h-8 text-xs"
                >
                  Show me a component example
                </Button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessageComponent
                  key={message.id}
                  message={message}
                  onRegenerate={
                    index === messages.length - 1 &&
                    message.role === "assistant"
                      ? onRegenerate
                      : undefined
                  }
                  isLast={index === messages.length - 1}
                />
              ))}
              <div ref={messagesEndRef} className="h-4" />
              {/* Added height for spacing */}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="absolute bottom-20 right-4 z-10">
          <Button
            onClick={() => scrollToBottom()}
            size="sm"
            className="rounded-full w-10 h-10 p-0 shadow-lg"
            variant="outline"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-4 border-t border-destructive/20 bg-destructive/5">
          <div className="flex items-center gap-2 text-destructive text-sm">
            <X className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Input */}
      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        placeholder="Ask about FARM Framework..."
      />
    </div>
  );
}
