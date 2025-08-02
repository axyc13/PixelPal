import { collection, addDoc, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface CharacterData {
  id?: string;
  name: string;
  imageUrl: string;
  prompt: string;
}

// Add a new character
export async function addCharacter(character: CharacterData) {
  const charactersRef = collection(db, "characters");
  const docRef = await addDoc(charactersRef, character);
  return { id: docRef.id, ...character };
}

// Get all characters
export async function getAllCharacters() {
  const charactersRef = collection(db, "characters");
  const snapshot = await getDocs(charactersRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get a single character by ID
export async function getCharacterById(id: string) {
  const characterRef = doc(db, "characters", id);
  const docSnap = await getDoc(characterRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}

// Update a character by ID
export async function updateCharacter(id: string, data: Partial<CharacterData>) {
  const characterRef = doc(db, "characters", id);
  await setDoc(characterRef, data, { merge: true });
}
