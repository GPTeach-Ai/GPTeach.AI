import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from '../components/Nav';
import { useDispatch } from 'react-redux';
import { getFirebaseAuth, onAuthStateChanged } from '../lib/firebase';
import { setUser, setAuthStatus } from '../features/auth/authSlice';

export default function AppLayout() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
        dispatch(setAuthStatus('succeeded')); // Mark as done if firebase is not configured
        return;
    };

    dispatch(setAuthStatus('loading'));
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      
      <Nav 
        isCollapsed={isNavCollapsed} 
        onToggle={() => setIsNavCollapsed(!isNavCollapsed)} 
      />

      <main className="flex-1 min-h-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}