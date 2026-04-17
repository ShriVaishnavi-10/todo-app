"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import TodoList from '../components/TodoList';
import { supabase } from '@/lib/supabase';
import { LogOut, Sun, Moon, Layout as LayoutIcon, User, Layers, Sparkles } from 'lucide-react';

import Logo from '@/components/Logo';

interface Todo {
  id: string;
  title: string;
  is_done: boolean;
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const fetchTodos = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    if (!error && data) setTodos(data.map(d => ({ id: d.id, title: d.title, is_done: d.is_done })));
    setLoading(false);
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/login');
    else fetchTodos();
  }, [session, status, router]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTodo = async (text: string) => {
    if (!session?.user?.id) return;
    const { data, error } = await supabase.from('todos').insert({ user_id: session.user.id, title: text, is_done: false }).select();
    if (!error && data) setTodos(prev => [data[0], ...prev]);
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    await supabase.from('todos').update({ is_done: !todo.is_done }).eq('id', id);
    setTodos(prev => prev.map(t => t.id === id ? { ...t, is_done: !t.is_done } : t));
  };

  const deleteTodo = async (id: string) => {
    await supabase.from('todos').delete().eq('id', id);
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const editTodo = async (id: string, newText: string) => {
    await supabase.from('todos').update({ title: newText }).eq('id', id);
    setTodos(prev => prev.map(t => t.id === id ? { ...t, title: newText } : t));
  };

  if (!mounted || status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
           <p className="text-xs font-semibold text-muted tracking-widest uppercase">Initializing</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="relative min-h-screen bg-background p-6 md:p-12 overflow-x-hidden transition-all duration-700">
      <div className="relative z-10 max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 p-8 rounded-[2rem] bg-accent/5 border border-accent/20 backdrop-blur-xl relative overflow-hidden group">
          {/* Animated Glow Background for Header */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-700" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center shadow-xl shadow-accent/20 border border-accent/10">
              <Logo className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Momentum</h1>
              <p className="text-xs text-muted font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                {todos.length} Objectives Refined
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-3 stealth-card rounded-2xl text-foreground hover:bg-accent hover:text-white border-accent/20 shadow-none hover:shadow-xl hover:shadow-accent/20"
            >
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User Profile */}
            <div className="relative" ref={menuRef}>
               <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="stealth-card p-2 pr-5 rounded-2xl flex items-center gap-3 hover:border-accent transition-all border-accent/20"
               >
                 <div className="w-10 h-10 rounded-xl overflow-hidden border border-accent/20 bg-accent-muted flex items-center justify-center">
                    {session.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt="avatar" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User size={16} className="text-accent" />
                    )}
                 </div>
                 <div className="flex flex-col items-start">
                    <span className="text-xs font-bold text-foreground truncate max-w-[100px] leading-none mb-1">{session.user?.name?.split(' ')[0]}</span>
                    <span className="text-[10px] text-muted font-medium leading-none">Pro Member</span>
                 </div>
               </button>

               <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-64 stealth-card shadow-2xl overflow-hidden p-3 z-50 rounded-3xl"
                  >
                    <div className="px-4 py-3 bg-accent/5 rounded-2xl border border-accent/10 mb-2 flex items-center gap-3">
                       <User size={16} className="text-accent" />
                       <div className="truncate">
                          <p className="text-xs font-bold text-foreground truncate">{session.user?.name}</p>
                          <p className="text-[10px] text-muted truncate">{session.user?.email}</p>
                       </div>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full px-4 py-4 text-left text-foreground hover:bg-red-500 hover:text-white rounded-2xl transition-all flex items-center gap-3 font-bold text-xs"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </motion.div>
                )}
               </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="space-y-8">
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="stealth-card p-8 flex flex-col justify-between h-40 relative overflow-hidden group border-accent/10">
               <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-4 block">Active Stream</span>
                  <p className="text-5xl font-bold text-foreground mt-2 tracking-tighter">{todos.filter(t => !t.is_done).length}</p>
               </div>
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Layers className="w-24 h-24 text-foreground" />
               </div>
               <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0" />
            </div>
            
            <div className="stealth-card p-8 flex flex-col justify-between h-40 relative overflow-hidden group bg-accent/[0.03] border-accent/20">
               <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-4 block">Archive Stream</span>
                  <p className="text-5xl font-bold text-foreground mt-2 tracking-tighter">{todos.filter(t => t.is_done).length}</p>
               </div>
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <LayoutIcon className="w-24 h-24 text-accent" />
               </div>
               <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent/100 to-accent/0" />
            </div>
          </div>

          {/* Main List Area */}
          <div className="stealth-card rounded-[2.5rem] overflow-hidden border-accent/10">
             <TodoList
              todos={todos}
              onAdd={addTodo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          </div>
        </main>
      </div>
    </div>
  );
}