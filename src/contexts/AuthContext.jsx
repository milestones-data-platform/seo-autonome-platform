'use client';

import { createContext, useContext, useState, useEffect } from 'react';

/**
 * @typedef {Object} User
 * @property {string} uid - User ID
 * @property {string} email - User email
 * @property {string} displayName - Display name
 * @property {string|null} photoURL - Profile photo URL
 * @property {string} role - User role (admin, editor, viewer)
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user - Current user or null if not authenticated
 * @property {boolean} isLoading - Whether auth state is being determined
 * @property {boolean} isAuthenticated - Whether user is authenticated
 * @property {Function} login - Login function
 * @property {Function} loginWithGoogle - Google OAuth login
 * @property {Function} logout - Logout function
 */

const AuthContext = createContext(undefined);

// Mock user for development - will be replaced by Firebase Auth
const MOCK_USER = {
  uid: 'dev_user_001',
  email: 'admin@seo-autonome.com',
  displayName: 'Admin Dev',
  photoURL: null,
  role: 'admin'
};

// Set to true to simulate authenticated state during development
const DEV_AUTO_LOGIN = true;

/**
 * AuthProvider Component
 * Provides authentication state and methods to the app
 * Currently mocked - ready for Firebase integration
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate checking auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In development, auto-login with mock user
      if (DEV_AUTO_LOGIN) {
        setUser(MOCK_USER);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
    
    // TODO: Replace with Firebase onAuthStateChanged
    // const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    //   if (firebaseUser) {
    //     setUser({
    //       uid: firebaseUser.uid,
    //       email: firebaseUser.email,
    //       displayName: firebaseUser.displayName,
    //       photoURL: firebaseUser.photoURL,
    //       role: 'user' // Fetch from Firestore
    //     });
    //   } else {
    //     setUser(null);
    //   }
    //   setIsLoading(false);
    // });
    // return () => unsubscribe();
  }, []);

  /**
   * Login with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('[AuthContext] Login attempt:', { email, password: '***' });
      
      // TODO: Replace with Firebase signInWithEmailAndPassword
      // await signInWithEmailAndPassword(auth, email, password);
      
      // For now, mock successful login
      setUser({
        ...MOCK_USER,
        email,
        displayName: email.split('@')[0]
      });
      
      return { success: true };
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login with Google OAuth
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const loginWithGoogle = async () => {
    setIsLoading(true);
    
    try {
      console.log('[AuthContext] Google login initiated - will connect to Firebase');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Replace with Firebase Google Auth
      // const provider = new GoogleAuthProvider();
      // await signInWithPopup(auth, provider);
      
      // Mock successful Google login
      setUser({
        ...MOCK_USER,
        email: 'user@gmail.com',
        displayName: 'Google User',
        photoURL: 'https://ui-avatars.com/api/?name=Google+User&background=4285f4&color=fff'
      });
      
      return { success: true };
    } catch (error) {
      console.error('[AuthContext] Google login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout the current user
   */
  const logout = async () => {
    setIsLoading(true);
    
    try {
      console.log('[AuthContext] Logout');
      
      // TODO: Replace with Firebase signOut
      // await signOut(auth);
      
      setUser(null);
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 * @returns {AuthContextType}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;
