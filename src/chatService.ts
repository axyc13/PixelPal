import { collection, addDoc, query, orderBy, limit, getDocs, Timestamp, startAfter } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { db } from "./firebase";

// Simple moderation utility
const BANNED_WORDS = [
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'dick', 'cunt', 'nigger', 'fag', 'slut', 'whore', 'retard', 'porn', 'sex', 'nude', 'kill', 'suicide', 'die', 'rape', 'abuse', 'violence'
  // Add more as needed
];

function containsBannedWords(text: string): boolean {
  const lower = text.toLowerCase();
  return BANNED_WORDS.some(word => lower.includes(word));
}

// Send a chat message (user or character) with moderation
export async function sendMessage(conversationId: string, sender: string, text: string) {
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

// Get chat messages for a conversation (paginated)
export async function getMessages(conversationId: string, pageSize = 20, lastVisible?: DocumentData) {
  const messagesRef = collection(db, "conversations", conversationId, "messages");
  let q = query(messagesRef, orderBy("timestamp", "desc"), limit(pageSize));
  if (lastVisible) {
    q = query(messagesRef, orderBy("timestamp", "desc"), startAfter(lastVisible), limit(pageSize));
  }
  const snapshot = await getDocs(q);
  const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return { messages, lastVisible: snapshot.docs[snapshot.docs.length - 1] };
}
