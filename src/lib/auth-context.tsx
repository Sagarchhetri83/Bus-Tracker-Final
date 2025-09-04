'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, rtdb } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { useRouter } from 'next/navigation';

interface UserData {
  uid: string;
  role: string;
  fullName: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Fetch user data from Realtime Database
          const userRef = ref(rtdb, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const data = snapshot.val();
            const userInfo: UserData = {
              uid: firebaseUser.uid,
              role: data.role,
              fullName: data.fullName,
              username: data.username,
              email: firebaseUser.email || data.email
            };
            
            setUserData(userInfo);
            localStorage.setItem('userData', JSON.stringify(userInfo));
          } else {
            // Fallback: create basic user data from Firebase Auth
            const userInfo: UserData = {
              uid: firebaseUser.uid,
              role: 'user',
              fullName: firebaseUser.displayName || 'User',
              username: firebaseUser.email?.split('@')[0] || 'user',
              email: firebaseUser.email || ''
            };
            
            setUserData(userInfo);
            localStorage.setItem('userData', JSON.stringify(userInfo));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Set basic user data on error
          const userInfo: UserData = {
            uid: firebaseUser.uid,
            role: 'user',
            fullName: firebaseUser.displayName || 'User',
            username: firebaseUser.email?.split('@')[0] || 'user',
            email: firebaseUser.email || ''
          };
          setUserData(userInfo);
        }
      } else {
        setUserData(null);
        localStorage.removeItem('userData');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setUserData(null);
      localStorage.removeItem('userData');
      router.push('/signup');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    userData,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
