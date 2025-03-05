/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Id } from "@/convex/_generated/dataModel";
import { Send, User, Bot, Loader2, Image, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  sections?: {
    title: string;
    content: string;
  }[];
  metadata?: {
    sentiment?: string;
    rating?: string;
    keyPoints?: string[];
  };
}

interface VideoChatProps {
  videoId: Id<"videos">;
  transcript?: string;
  analysis?: any; // Type this properly based on your analysis schema
}

export function VideoChat({ videoId, transcript, analysis }: VideoChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  // Auto-resize textarea based on content
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage, 
          videoId,
          context: {
            transcript,
            analysis
          }
        }),
      });

      const data = await response.json();
      
      // Handle image generation response
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setMessages(prev => [...prev, { 
          role: "assistant",
          content: data.response,
          imageUrl: data.imageUrl,
          ...(data.sections && { sections: data.sections }),
          ...(data.metadata && { metadata: data.metadata })
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: "assistant",
          content: data.response,
          ...(data.sections && { sections: data.sections }),
          ...(data.metadata && { metadata: data.metadata })
        }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error processing your request. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key to submit (Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">How can I help you?</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Ask me questions about the video, request title suggestions, or generate thumbnails. I&apos;m here to help!
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("Can you generate a new thumbnail for this video?")}
              >
                <Image className="h-4 w-4 mr-2" />
                Generate Thumbnail
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("Can you suggest some engaging titles for this video?")}
              >
                <Type className="h-4 w-4 mr-2" />
                Generate Titles
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((message, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex items-start gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl p-4",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted rounded-tl-none"
                    )}
                  >
                    {message.sections ? (
                      <div className="space-y-4">
                        {message.sections.map((section, idx) => (
                          <div key={idx} className="space-y-2">
                            <h4 className="font-semibold text-sm">{section.title}</h4>
                            <p className="text-sm whitespace-pre-wrap">{section.content}</p>
                          </div>
                        ))}
                        {message.metadata && (
                          <div className="mt-4 pt-4 border-t border-border/50">
                            {message.metadata.sentiment && (
                              <p className="text-xs text-muted-foreground">
                                <span className="font-medium">Sentiment:</span> {message.metadata.sentiment}
                              </p>
                            )}
                            {message.metadata.rating && (
                              <p className="text-xs text-muted-foreground">
                                <span className="font-medium">Content Rating:</span> {message.metadata.rating}
                              </p>
                            )}
                            {message.metadata.keyPoints && message.metadata.keyPoints.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-muted-foreground">Key Points:</p>
                                <ul className="list-disc list-inside text-xs text-muted-foreground mt-1">
                                  {message.metadata.keyPoints.map((point, idx) => (
                                    <li key={idx}>{point}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                    {message.imageUrl && (
                      <div className="mt-2">
                        <img 
                          src={message.imageUrl} 
                          alt="Generated thumbnail"
                          className="rounded-lg w-full max-w-md"
                        />
                      </div>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 justify-start"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted max-w-[80%] rounded-2xl rounded-tl-none p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Thinking...</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the video..."
            className="min-h-[60px] pr-12 resize-none py-3 max-h-[150px] overflow-y-auto"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 bottom-2 h-8 w-8"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
} 