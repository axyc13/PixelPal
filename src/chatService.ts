// chatService.ts
// Service for managing chat conversations with characters

import type { Character } from './characterService';
import { generateCharacterResponse, generateAlternateEndingDiscussion } from './characterService';
import { collection, addDoc, query, orderBy, limit, getDocs, Timestamp, startAfter } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { db } from "./firebase";

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  characterId?: string;
}

export interface ChatSession {
  id: string;
  characterId: string;
  character: Character;
  messages: ChatMessage[];
  createdAt: Date;
  lastActivity: Date;
}



// Simple moderation utility
const BANNED_WORDS = [
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'dick', 'cunt', 'nigger', 'fag', 'slut', 'whore', 'retard', 'porn', 'sex', 'nude', 'kill', 'suicide', 'die', 'rape', 'abuse', 'violence'
  // Add more as needed
];

function containsBannedWords(text: string): boolean {
  const lower = text.toLowerCase();
  return BANNED_WORDS.some(word => lower.includes(word));
}

class ChatService {
  private sessions: Map<string, ChatSession> = new Map();

  // Create a new chat session with a character
  createChatSession(character: Character): ChatSession {
    const sessionId = `chat_${character.id}_${Date.now()}`;
    const session: ChatSession = {
      id: sessionId,
      characterId: character.id,
      character,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date()
    };
    
    this.sessions.set(sessionId, session);
    return session;
  }

  // Get a chat session by ID
  getChatSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  // Send a message to a character
  async sendMessage(sessionId: string, content: string): Promise<ChatMessage> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Chat session not found');
    }

    // Check for banned words
    if (containsBannedWords(content)) {
      throw new Error('Message contains inappropriate content and was blocked.');
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    session.messages.push(userMessage);
    session.lastActivity = new Date();

    // Generate character response
    const conversationHistory = session.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const characterResponse = await generateCharacterResponse(
      session.character,
      content,
      conversationHistory
    );

    // Add character response
    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now()}_assistant`,
      content: characterResponse,
      role: 'assistant',
      timestamp: new Date(),
      characterId: session.characterId
    };

    session.messages.push(assistantMessage);
    session.lastActivity = new Date();

    return assistantMessage;
  }

  // Start an alternate ending discussion
  async startAlternateEndingDiscussion(
    sessionId: string,
    originalEnding: string,
    userRequest: string
  ): Promise<ChatMessage> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Chat session not found');
    }

    const discussion = await generateAlternateEndingDiscussion(
      session.character,
      originalEnding,
      userRequest
    );

    const message: ChatMessage = {
      id: `alt_${Date.now()}`,
      role: 'assistant',
      content: discussion,
      timestamp: new Date(),
      characterId: session.characterId
    };

    session.messages.push(message);
    session.lastActivity = new Date();

    return message;
  }

  // Get all active chat sessions
  getActiveChatSessions(): ChatSession[] {
    return Array.from(this.sessions.values());
  }

  // Clear old sessions (cleanup)
  clearOldSessions(maxAge: number = 24 * 60 * 60 * 1000): void {
    const now = new Date();
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now.getTime() - session.lastActivity.getTime() > maxAge) {
        this.sessions.delete(sessionId);
      }
    }
  }

  // Firebase functions (preserved from original)
  async sendMessageToFirebase(conversationId: string, sender: string, text: string) {
    if (containsBannedWords(text)) {
      throw new Error('Message contains inappropriate content and was blocked.');
    }
    const messagesRef = collection(db, "conversations", conversationId, "messages");
    const messageData = {
      sender, // 'user' or character name/id
      text,
      timestamp: Timestamp.now(),
    };
    const docRef = await addDoc(messagesRef, messageData);
    return { id: docRef.id, ...messageData };
  }

  async getMessagesFromFirebase(conversationId: string, pageSize = 20, lastVisible?: DocumentData) {
    const messagesRef = collection(db, "conversations", conversationId, "messages");
    let q = query(messagesRef, orderBy("timestamp", "desc"), limit(pageSize));
    if (lastVisible) {
      q = query(messagesRef, orderBy("timestamp", "desc"), startAfter(lastVisible), limit(pageSize));
    }
    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { messages, lastVisible: snapshot.docs[snapshot.docs.length - 1] };
  }
}

// Export singleton instance
export const chatService = new ChatService();
