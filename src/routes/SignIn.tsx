import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { getFirebaseAuth, GoogleAuthProvider } from '../lib/firebase';
import { setUser } from '../features/auth/authSlice';
import { User as UserIcon, LogIn } from 'lucide-react';
import { RootState } from '../app/store';

// Initialize the Google Auth provider and add the calendar scope for future use
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar');

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state: RootState) => state.auth);

  const handleSignIn = async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      alert('Firebase is not configured. Please check your environment variables.');
      return;
    }
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }));
        navigate('/'); // Navigate to home after successful sign-in
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      // Handle errors here, such as by displaying a notification
    }
  };

  return (
    <div className="p-6 h-full flex items-center justify-center">
      <div className="text-center pb-28 max-w-sm">
        <div className="mx-auto h-24 w-24 mb-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          <UserIcon size={64} className="text-slate-400 dark:text-slate-500" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">Sign In</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Sign in with your Google account to save and sync your lesson plans, classes, and preferences.
        </p>
        <div className="mt-8">
          <button
            onClick={handleSignIn}
            disabled={status === 'loading'}
            className="w-full flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl bg-emerald-500 text-white font-semibold text-xl hover:bg-emerald-600 transition-colors disabled:bg-emerald-300"
          >
            <LogIn size={24} />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}