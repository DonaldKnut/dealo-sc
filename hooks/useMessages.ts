import { useState, useEffect, useCallback } from "react";
import { MessageService, Message } from "@/service/messageService";
import { useApi } from "./useApi";

interface UseMessagesOptions {
  conversationId?: string;
  autoFetch?: boolean;
  refetchInterval?: number;
}

interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: Error | null;
  sendMessage: (content: string, recipientId: string) => Promise<void>;
  fetchMessages: () => Promise<void>;
  clearMessages: () => void;
}

/**
 * Hook for managing messages
 * Extracted from FloatingMessageBubble component logic
 */
export function useMessages(
  options: UseMessagesOptions = {}
): UseMessagesReturn {
  const { conversationId, autoFetch = true, refetchInterval } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const { loading, error, execute } = useApi<Message[]>(
    () => MessageService.fetchMessages(conversationId),
    {
      onSuccess: (data) => {
        if (data) setMessages(data);
      },
    }
  );

  const fetchMessages = useCallback(async () => {
    await execute();
  }, [execute]);

  useEffect(() => {
    if (autoFetch) {
      fetchMessages();
    }
  }, [autoFetch, fetchMessages]);

  // Auto-refetch interval
  useEffect(() => {
    if (refetchInterval) {
      const interval = setInterval(fetchMessages, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [refetchInterval, fetchMessages]);

  const sendMessage = useCallback(
    async (content: string, recipientId: string) => {
      try {
        const newMessage = await MessageService.sendMessage(content, recipientId);
        setMessages((prev) => [...prev, newMessage]);
      } catch (err) {
        console.error("Error sending message:", err);
        throw err;
      }
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    fetchMessages,
    clearMessages,
  };
}



