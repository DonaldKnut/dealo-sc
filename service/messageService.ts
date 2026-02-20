/**
 * Message Service - Business logic for messaging
 * Extracted from FloatingMessageBubble component
 */

import { api } from "@/lib/api/client";

export interface Message {
  id: string;
  type: "user" | "bot" | "system";
  content: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  isOwn?: boolean;
}

export class MessageService {
  /**
   * Fetch messages for a conversation
   */
  static async fetchMessages(conversationId?: string): Promise<Message[]> {
    try {
      const url = conversationId 
        ? `/api/messages?conversationId=${conversationId}`
        : "/api/messages";
      
      const response = await api.get<{ messages: Message[] }>(url);
      return response.messages || [];
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }

  /**
   * Send a message
   */
  static async sendMessage(
    content: string,
    recipientId: string
  ): Promise<Message> {
    try {
      const response = await api.post<Message>("/api/messages", {
        content,
        recipientId,
      });
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  /**
   * Format message timestamp
   */
  static formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
}



