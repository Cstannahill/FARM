import React from "react";
import { X, Send, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownViewer } from "./MarkdownViewer";
import { useChat } from "@/hooks/use-chat";
import type { ChatMessage } from "@/types/chat";

interface AIChatAsideProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex max-w-[90%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        } gap-2`}
      >
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
        )}
        <div
          className={`px-3 py-2 rounded-lg ${
            isUser
              ? "bg-blue-500 text-white"
              : "bg-muted text-foreground border"
          }`}
        >
          {isUser ? (
            // User messages: simple text
            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
          ) : (
            // AI messages: use MarkdownViewer for rich formatting
            <div className="text-sm">
              <MarkdownViewer
                content={message.content}
                className="prose-sm prose-p:my-1 prose-headings:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-pre:my-2"
              />
            </div>
          )}
          {message.timestamp && (
            <div
              className={`text-xs mt-1 opacity-70 ${
                isUser ? "text-blue-100" : "text-muted-foreground"
              }`}
            >
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>
        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs text-primary-foreground font-medium">
              You
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const TypingIndicator: React.FC = () => (
  <div className="flex justify-start mb-4">
    <div className="flex gap-2">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-muted text-foreground border px-3 py-2 rounded-lg">
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.4s]"></div>
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            Assistant is thinking...
          </span>
        </div>
      </div>
    </div>
  </div>
);

export const AIChatAside: React.FC<AIChatAsideProps> = ({
  isOpen,
  onClose,
}) => {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const [input, setInput] = React.useState("");
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Use multiple approaches to ensure scrolling works
    const scroll = () => {
      if (messagesContainerRef.current) {
        const container = messagesContainerRef.current;
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    // Immediate scroll
    scroll();

    // Delayed scroll to handle dynamic content
    requestAnimationFrame(() => {
      scroll();
    });

    // Final scroll after a small delay
    setTimeout(scroll, 50);
  };

  React.useEffect(() => {
    // Scroll when messages change
    scrollToBottom();
  }, [messages]);

  React.useEffect(() => {
    // Also scroll when loading state changes (for typing indicator)
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput(""); // Clear input after sending
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Aside Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 lg:w-96 xl:w-[400px] bg-background border-l shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Assistant</h2>
                <p className="text-xs text-muted-foreground">
                  AI-powered help for FARM Framework
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Chat Messages - Scrollable Area */}
          <div className="flex-1 overflow-hidden">
            <div
              ref={messagesContainerRef}
              className="h-full overflow-y-auto p-4 space-y-4"
            >
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                    <Bot className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">
                    What is FARM Framework used for?
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Based on the search results, I can provide you with a
                    comprehensive overview of what FARM Framework is used for.
                  </p>

                  <div className="space-y-2 text-left">
                    <p className="text-xs text-muted-foreground mb-3">
                      Try asking:
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs h-auto py-2"
                      onClick={() =>
                        setInput("What is FARM Framework purpose overview")
                      }
                    >
                      📋 What is FARM Framework purpose overview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs h-auto py-2"
                      onClick={() =>
                        setInput("How do I get started with FARM?")
                      }
                    >
                      🚀 How do I get started with FARM?
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs h-auto py-2"
                      onClick={() => setInput("Explain Type-Sync features")}
                    >
                      🔄 Explain Type-Sync features
                    </Button>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {error && (
                <div className="flex justify-start mb-4">
                  <div className="flex gap-2 max-w-[90%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-3 py-2 rounded-lg">
                      <div className="text-sm">
                        <strong>Error:</strong> {error}
                      </div>
                      <div className="text-xs mt-1 opacity-70">
                        Please try again or check your connection.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t p-4 bg-background flex-shrink-0">
            {messages.length > 0 && (
              <div className="mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearChat}
                  className="text-xs"
                >
                  Clear conversation
                </Button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about FARM Framework..."
                  className="min-h-[60px] pr-12 resize-none"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || isLoading}
                  className="absolute bottom-2 right-2 h-8 w-8 p-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Press Enter to send, Shift + Enter for new line
              </p>{" "}
            </form>
          </div>
        </div>
      </aside>
    </>
  );
};
