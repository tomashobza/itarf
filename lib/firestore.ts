import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  increment,
  query,
  orderBy,
  limit,
  where,
  QueryDocumentSnapshot,
  DocumentData,
  getDoc,
  serverTimestamp,
  Timestamp,
  startAfter,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import { TraitType, TraitWithTotalType } from "@/lib/types";

// Helper function to convert Firestore document to TraitType
const docToTrait = (doc: QueryDocumentSnapshot<DocumentData>): TraitType => {
  const data = doc.data();
  return {
    id: doc.id,
    text: data.text,
    isApproved: data.isApproved,
    votes: {
      redFlag: data.votes?.redFlag || 0,
      greenFlag: data.votes?.greenFlag || 0,
      neutral: data.votes?.neutral || 0,
    },
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
  };
};

// Get all traits (with pagination)
export const getTraits = async (
  limitCount = 20,
  lastVisible?: QueryDocumentSnapshot<DocumentData>
): Promise<{
  traits: TraitType[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}> => {
  const constraints: QueryConstraint[] = [
    where("isApproved", "==", true),
    orderBy("createdAt", "desc"),
    limit(limitCount),
  ];

  if (lastVisible) {
    constraints.push(startAfter(lastVisible));
  }

  const q = query(collection(db, "traits"), ...constraints);

  const querySnapshot = await getDocs(q);
  const traits = querySnapshot.docs.map(docToTrait);
  const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
  return { traits, lastDoc };
};

// Submit a new TraitType
export const submitTrait = async (text: string): Promise<string> => {
  const traitData = {
    text: text.trim(),
    isApproved: false, // Requires manual approval
    votes: {
      redFlag: 0,
      greenFlag: 0,
      neutral: 0,
    },
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "traits"), traitData);
  return docRef.id;
};

// Vote on a TraitType (no duplicate checking without users)
export const voteOnTrait = async (
  traitId: string,
  voteType: "redFlag" | "greenFlag" | "neutral"
): Promise<void> => {
  const traitRef = doc(db, "traits", traitId);
  await updateDoc(traitRef, {
    [`votes.${voteType}`]: increment(1),
  });
};

// Get random traits for judging
export const getRandomTraits = async (count = 10): Promise<TraitType[]> => {
  const q = query(
    collection(db, "traits"),
    where("isApproved", "==", true),
    limit(count * 3) // Get more than needed for randomization
  );

  const querySnapshot = await getDocs(q);
  const allTraits = querySnapshot.docs.map(docToTrait);

  // Shuffle and return requested count
  const shuffled = allTraits.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Get traits sorted by total votes (most popular) - FIXED VERSION
export const getPopularTraits = async (
  limitCount = 20
): Promise<TraitWithTotalType[]> => {
  const q = query(collection(db, "traits"), where("isApproved", "==", true));

  const querySnapshot = await getDocs(q);
  const traits = querySnapshot.docs.map(docToTrait);

  // Calculate total votes and sort
  const traitsWithTotals: TraitWithTotalType[] = traits.map((trait) => ({
    ...trait,
    totalVotes:
      trait.votes.redFlag + trait.votes.greenFlag + trait.votes.neutral,
  }));

  traitsWithTotals.sort((a, b) => b.totalVotes - a.totalVotes);
  return traitsWithTotals.slice(0, limitCount);
};

// Get a specific TraitType by ID
export const getTraitById = async (id: string): Promise<TraitType | null> => {
  const docRef = doc(db, "traits", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docToTrait(docSnap);
  }
  return null;
};
