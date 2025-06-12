import React from "react";
import { Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-chat";
import ChatInterface from "@/components/chat-interface";

interface ChatSidebarProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ChatSidebar({
  children,
  open,
  onOpenChange,
}: ChatSidebarProps) {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    regenerateLastMessage,
  } = useChat();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:w-[480px] p-0 flex flex-col h-full"
      >
        <ChatInterface
          messages={messages}
          onSendMessage={sendMessage}
          onRegenerate={regenerateLastMessage}
          onClearChat={clearChat}
          isLoading={isLoading}
          error={error}
          title="FARM Assistant"
        />
      </SheetContent>
    </Sheet>
  );
}

// Export a pre-configured trigger button for convenience
export function ChatTriggerButton({
  className,
  variant = "outline",
  size = "default",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button variant={variant} size={size} className={className} {...props}>
      <Sparkles className="mr-2 h-4 w-4" />
      Ask AI Assistant
      <div className="ml-auto flex items-center gap-1">
        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">
          AI
        </span>
      </div>
    </Button>
  );
}
