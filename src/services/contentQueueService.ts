import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  where, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { generateWeeklyStrategy } from './geminiService';

export const generateAndPopulateWeeklyCalendar = async (context: string) => {
  if (!auth.currentUser) throw new Error("Authentication required");
  
  const strategyPosts = await generateWeeklyStrategy(context);
  
  // Save strategy metadata
  const stratRef = await addDoc(collection(db, 'weekly_strategies'), {
    weekStartDate: strategyPosts[0].date,
    strategyDescription: `Targeting: ${context}`,
    authorId: auth.currentUser.uid,
    createdAt: serverTimestamp(),
  });

  // Create pending posts
  const postPromises = strategyPosts.map(post => 
    addDoc(collection(db, 'posts'), {
      platform: post.platform,
      content: post.content,
      status: 'pending_approval',
      scheduledAt: post.date,
      strategyId: stratRef.id,
      authorId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    })
  );

  await Promise.all(postPromises);
  return { strategyId: stratRef.id, count: strategyPosts.length };
};

export const approveAndSchedulePost = async (postId: string) => {
  if (!auth.currentUser) throw new Error("Authentication required");
  
  const postDocRef = doc(db, 'posts', postId);
  
  // In a real app, we'd fetch the doc first to get content/platform
  // Then call Ayrshare. For this implementation, we assume the UI provides/fetches it.
};

export const publishPostNow = async (post: any) => {
  // Retrieve token from localStorage (simplified for demo)
  const token = localStorage.getItem(`${post.platform}_token`);
  
  if (!token) {
    throw new Error(`Connection to ${post.platform} required. Please link your account first.`);
  }

  const response = await fetch(`/api/post/${post.platform}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      content: post.content,
      userId: auth.currentUser?.uid
    })
  });

  const result = await response.json();
  
  if (result.status === 'error') {
    throw new Error(result.message?.message || "Transmission signal lost");
  }

  const postDocRef = doc(db, 'posts', post.id);
  await updateDoc(postDocRef, {
    status: 'published',
    publishedAt: serverTimestamp(),
    externalId: result.id
  });

  return result;
};
