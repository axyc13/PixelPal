import { collection, addDoc, getDocs, doc, getDoc, setDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export interface ConversationMeta {
  id?: string;
  userId: string;
  characterId: string;
  createdAt: string;
  updatedAt: string;
  title?: string; // Optional: user can name the conversation
}

// Create a new conversation
export async function createConversation(meta: Omit<ConversationMeta, "id" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();
  const conversation = { ...meta, createdAt: now, updatedAt: now };
  const conversationsRef = collection(db, "conversations");
  const docRef = await addDoc(conversationsRef, conversation);
  return { id: docRef.id, ...conversation };
}

// Update conversation's updatedAt (call this when a new message is sent)
export async function updateConversationTimestamp(conversationId: string) {
  const conversationRef = doc(db, "conversations", conversationId);
  await setDoc(conversationRef, { updatedAt: new Date().toISOString() }, { merge: true });
}

// Get all conversations for a user (most recent first)
export async function getUserConversations(userId: string) {
  const conversationsRef = collection(db, "conversations");
  const q = query(conversationsRef, where("userId", "==", userId), orderBy("updatedAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get a single conversation by ID
export async function getConversationById(conversationId: string) {
  const conversationRef = doc(db, "conversations", conversationId);
  const docSnap = await getDoc(conversationRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}
