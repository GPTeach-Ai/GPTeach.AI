import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { getFirebaseAuth, signOut } from '../lib/firebase';
import { RootState } from '../app/store';
import { clearUser } from '../features/auth/authSlice';
import { cn } from '../lib/utils';

export default function UserControl({ isCollapsed }: { isCollapsed: boolean }) {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const textClass = cn(
        'whitespace-nowrap overflow-hidden transition-all duration-200 ease-in-out',
        isCollapsed ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'
    );
     const linkClass = ({ isActive }: { isActive: boolean }) =>
        cn(
        'flex items-center gap-4 py-2 rounded-lg text-base font-medium transition-colors w-full',
        isCollapsed ? 'px-[1.375rem]' : 'px-4',
        isActive
            ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-50'
            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        const auth = getFirebaseAuth();
        if (auth) {
            await signOut(auth);
            dispatch(clearUser());
            navigate('/');
        }
    };
    
    if (!user) {
        return (
            <NavLink to="/signin" className={linkClass({ isActive: false })}>
                 <LogIn size={20} className="flex-shrink-0" />
                 <span className={textClass}>Sign In</span>
            </NavLink>
        );
    }

    return (
         <div className="relative" ref={menuRef}>
            {isMenuOpen && (
                 <div className={cn(
                    "absolute left-2 right-2 bottom-full mb-2 w-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20",
                    isCollapsed && "left-auto -right-2 top-0 w-48 translate-x-full"
                 )}>
                    <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                         <p className="font-semibold text-sm truncate">{user.displayName}</p>
                         <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <ul className="py-1 text-sm text-slate-700 dark:text-slate-300">
                        <li>
                            <button onClick={handleSignOut} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                                <LogOut size={16} /> Sign Out
                            </button>
                        </li>
                    </ul>
                 </div>
            )}
            <button onClick={() => setIsMenuOpen(p => !p)} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100">
                {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className={cn("w-8 h-8 rounded-full flex-shrink-0")} />
                ) : (
                    <span className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <UserIcon size={20} />
                    </span>
                )}
                 <div className={cn(textClass, "flex-1 overflow-hidden text-left")}>
                    <p className="font-semibold text-sm truncate">{user.displayName}</p>
                 </div>
            </button>
         </div>
    );
}