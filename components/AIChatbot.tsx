"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Briefcase,
  Users,
  Award,
  Video,
  Building,
  CreditCard,
  HelpCircle,
  Lightbulb,
  Rocket,
  ChevronRight,
  Wifi,
  Clock,
  Brain,
  Target,
  TrendingUp,
  Zap,
  Minimize2,
  Maximize2,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  category?: "platform" | "business" | "professional" | "learning";
  suggestions?: string[];
  isStreaming?: boolean;
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hey there! 👋 I'm Sarah, your friendly Dealo assistant. I'm here to help you navigate our platform, grow your career, or answer any questions you might have. What can I help you with today?",
      timestamp: new Date(),
      category: "platform",
      suggestions: [
        "How do I get started?",
        "Tell me about courses",
        "Business development tips",
        "Career advice",
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamingRef = useRef<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Quick responses with more human-like language
  const quickResponses: Record<string, { content: string; category: string; suggestions?: string[] }> = {
    "How do I get started?": {
      content: "Great question! Getting started is super simple. First, create your account (you can use email or sign in with Google/LinkedIn). Then, complete your profile - add your skills, experience, and what you're interested in. After that, you can explore courses, start freelancing, or connect with other professionals. What interests you most?",
      category: "platform",
      suggestions: ["Tell me about courses", "How does freelancing work?", "What's the social platform?"],
    },
    "How do I create an account?": {
      content: "Creating an account is really quick! Just click the 'Get Started' button in the header, or visit our sign-up page. You can register with your email or use Google/LinkedIn for instant access. Once you're in, you'll have access to all our features - courses, freelancing, networking, and more!",
      category: "platform",
      suggestions: ["What features do I get?", "How do I verify my account?", "Can I use social login?"],
    },
    "Tell me about courses": {
      content: "Our courses are pretty awesome! They're AI-powered and cover everything from technical skills to business development. Each course includes interactive lessons, real-world projects, and you can earn certifications that employers actually recognize. Plus, our AI adapts to your learning style. Want to know more about a specific topic?",
      category: "platform",
      suggestions: ["What courses are available?", "How much do courses cost?", "Can I get certified?"],
    },
    "How does freelancing work?": {
      content: "Our freelance marketplace is where talent meets opportunity! You can offer services in design, development, marketing, writing, consulting - pretty much anything. Set your own rates, showcase your portfolio, and build relationships with clients. It's a great way to earn while building your reputation. Ready to get started?",
      category: "platform",
      suggestions: ["How do I start freelancing?", "What services can I offer?", "How do payments work?"],
    },
    "Business development strategies": {
      content: "Here's what I'd recommend for business growth: First, build a strong personal brand by consistently sharing valuable content. Network actively on our platform - you never know who you'll meet! Use our AI tools for market research and stay ahead of trends. Also, consider diversifying your income through freelancing and courses. Want me to dive deeper into any of these?",
      category: "business",
      suggestions: ["How to build a personal brand?", "Networking strategies", "Income diversification"],
    },
    "Career advancement tips": {
      content: "Career growth is all about continuous improvement! I'd suggest: Keep learning through our courses (they're really good, promise!), build your network, showcase your work through freelancing projects, and create content that shows your expertise. Also, don't underestimate the power of mentorship - we have great opportunities for that here. What area would you like to focus on?",
      category: "professional",
      suggestions: ["Skill development strategies", "Professional networking", "Personal branding"],
    },
  };

  // Stream text character by character for human-like effect
  const streamText = (text: string, messageId: string, speed: number = 30) => {
    if (streamingRef.current) return;
    streamingRef.current = true;
    
    let index = 0;
    const streamInterval = setInterval(() => {
      if (index < text.length) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, content: text.substring(0, index + 1), isStreaming: true }
              : msg
          )
        );
        index++;
        scrollToBottom();
      } else {
        clearInterval(streamInterval);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isStreaming: false } : msg
          )
        );
        streamingRef.current = false;
      }
    }, speed);
  };

  // Call Gemini AI with streaming support
  const callGeminiAI = async (question: string, category: string) => {
    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          category,
          context:
            "You are Sarah, a friendly and professional assistant for Dealo. Be conversational, warm, and helpful. Use natural language, occasional emojis, and make responses feel human. Keep responses concise (2-3 paragraphs max) but comprehensive. Address the user directly and be encouraging.",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error calling Gemini AI:", error);
      return null;
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Check for quick response
    const quickResponse = quickResponses[content as keyof typeof quickResponses];

    if (quickResponse) {
      // Quick response with human-like delay
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: "",
          timestamp: new Date(),
          category: quickResponse.category as "platform" | "business" | "professional" | "learning",
          suggestions: quickResponse.suggestions,
          isStreaming: true,
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        // Stream the response for human-like effect
        streamText(quickResponse.content, botMessage.id, 20);
      }, 300 + Math.random() * 200); // Faster, more natural delay
    } else {
      // Use Gemini AI
      try {
        const aiResponse = await callGeminiAI(content, "general");

        if (aiResponse) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "bot",
            content: "",
            timestamp: new Date(),
            category: "professional",
            suggestions: [
              "More business tips",
              "Career advice",
              "Learning strategies",
              "Platform questions",
            ],
            isStreaming: true,
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
          // Stream the AI response
          streamText(aiResponse, botMessage.id, 15);
        } else {
          // Fallback response
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "bot",
            content: "",
            timestamp: new Date(),
            category: "platform",
            suggestions: [
              "Business development tips",
              "Career guidance",
              "How do I get started?",
              "Tell me about courses",
            ],
            isStreaming: true,
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
          const fallbackText =
            "Hmm, let me think about that... 🤔 I'm here to help with professional development, business advice, and platform questions. Could you rephrase your question or ask about specific topics like business development, career guidance, learning strategies, or platform features?";
          streamText(fallbackText, botMessage.id, 20);
        }
      } catch (error) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: "",
          timestamp: new Date(),
          category: "platform",
          suggestions: [
            "How do I get started?",
            "Business development tips",
            "Career guidance",
            "Tell me about courses",
          ],
          isStreaming: true,
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        const errorText =
          "Oops! I'm having a bit of trouble right now. 😅 But I'm still here to help! Try asking about our platform features, business development tips, or career guidance. Or feel free to rephrase your question!";
        streamText(errorText, botMessage.id, 20);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isTyping) {
      handleSendMessage(suggestion);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-gray-900 via-[#1a2a1a] to-gray-900 text-white rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 z-[9999] flex items-center justify-center group backdrop-blur-sm border border-green-400/50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
          
          {/* Online Status Indicator */}
          <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-gray-900 shadow-lg animate-pulse"></div>

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2 }}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gradient-to-br from-gray-900 via-[#1a2a1a] to-gray-900 text-white px-3 py-2 rounded-lg shadow-xl border border-green-400/50 whitespace-nowrap hidden md:block text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-xs">Chat with Sarah</p>
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-gradient-to-br from-gray-900 via-[#1a2a1a] to-gray-900 border-r border-b border-green-400/50 rotate-45"></div>
          </motion.div>
        </motion.button>
      )}

      {/* Backdrop Blur when chat is open */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? "auto" : "600px"
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed bottom-6 right-6 w-[380px] ${isMinimized ? "h-auto" : "h-[600px]"} max-h-[85vh] bg-gradient-to-br from-gray-900/95 via-[#1a2a1a]/95 to-gray-900/95 rounded-2xl shadow-2xl border border-green-400/50 z-[9999] flex flex-col overflow-hidden backdrop-blur-2xl`}
            style={{
              maxWidth: "calc(100vw - 3rem)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-800 via-[#1a2a1a] to-gray-800 rounded-t-2xl border-b border-green-400/30">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative">
                  <div className="w-10 h-10 bg-green-600/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-green-400/50">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">
                    Sarah - Dealo Assistant
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></div>
                    <p className="text-xs text-white/90 truncate">
                      {isTyping ? "Typing..." : "Online • Usually replies instantly"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-gradient-to-b from-gray-900/50 via-[#1a2a1a]/50 to-gray-900/50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} gap-2`}
                    >
                        {message.type === "bot" && (
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border border-green-400/30">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                          message.type === "user"
                            ? "bg-gradient-to-br from-green-600 to-green-700 text-white border border-green-400/30"
                            : "bg-gradient-to-br from-gray-800 via-[#1a2a1a] to-gray-800 text-white border border-green-400/20"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                          {message.isStreaming && (
                            <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse"></span>
                          )}
                        </p>

                        {/* Suggestions */}
                        {message.suggestions && message.type === "bot" && !message.isStreaming && (
                          <div className="mt-3 space-y-1.5">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                disabled={isTyping}
                                className="block w-full text-left p-2.5 bg-gray-800/50 hover:bg-green-600/20 rounded-lg text-xs text-white hover:text-green-300 transition-all border border-green-400/20 hover:border-green-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <div className="flex items-center gap-2">
                                  <ChevronRight className="w-3 h-3" />
                                  {suggestion}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {message.type === "user" && (
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start gap-2"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 border border-green-400/30">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gradient-to-br from-gray-800 via-[#1a2a1a] to-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-green-400/20">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                          </div>
                          <span className="text-xs text-white/80">Sarah is typing...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                  onSubmit={handleSubmit}
                  className="p-4 border-t border-green-400/30 bg-gradient-to-br from-gray-900 via-[#1a2a1a] to-gray-900"
                >
                  <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full px-4 py-3 pr-12 border border-green-400/30 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm bg-gray-800/50 focus:bg-gray-800 text-white placeholder:text-gray-400"
                        disabled={isTyping}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isTyping}
                      className="p-3 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl border border-green-400/30"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Get started", "Courses", "Business tips", "Career help"].map((action) => (
                      <button
                        key={action}
                        onClick={() => handleSendMessage(action)}
                        disabled={isTyping}
                        className="px-3 py-1.5 bg-gray-800/50 hover:bg-green-600/20 border border-green-400/20 hover:border-green-400/40 rounded-full text-xs text-white hover:text-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
