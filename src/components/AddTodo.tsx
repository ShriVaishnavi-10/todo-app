"use client"

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface AddTodoProps {
  onAdd: (text: string) => void;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1 group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Append New Objective..."
          className="w-full bg-background border border-border rounded-xl px-6 py-4 text-foreground placeholder-muted focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all duration-300 font-medium"
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={!text.trim()}
        className="px-8 py-4 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:translate-y-0 shadow-lg shadow-accent/20"
      >
        <Plus size={18} className="stroke-[3]" />
        Assign Task
      </motion.button>
    </form>
  );
}