"use client";

import React, { useState, memo } from 'react';
import { Check, Trash2, Edit3, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Todo {
  id: string;
  title: string;
  is_done: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

const TodoItem = memo(({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);

  const handleEdit = () => {
    if (isEditing) {
      if (editText.trim()) {
        onEdit(todo.id, editText.trim());
      }
      setIsEditing(false);
    } else {
      setEditText(todo.title);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setEditText(todo.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEdit();
    else if (e.key === 'Escape') handleCancel();
  };

  return (
    <div className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 will-change-transform ${
      todo.is_done 
        ? 'bg-background border-border opacity-50' 
        : 'bg-surface/50 border-border hover:border-accent hover:shadow-xl hover:shadow-accent/5'
    }`}>
      <button
        onClick={() => onToggle(todo.id)}
        className={`relative w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
          todo.is_done
            ? 'bg-accent border-accent'
            : 'bg-transparent border-muted hover:border-accent'
        }`}
      >
        <AnimatePresence>
          {todo.is_done && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Check size={14} className="text-white stroke-[3]" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 text-base bg-background border border-accent rounded-lg px-3 py-1 text-foreground focus:outline-none"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 text-base font-semibold transition-all duration-300 ${
            todo.is_done ? 'line-through text-muted' : 'text-foreground'
          }`}
        >
          {todo.title}
        </span>
      )}

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isEditing ? (
          <>
            <button
              onClick={handleEdit}
              className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
            >
              <Save size={18} />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-muted hover:bg-muted/10 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
          >
            <Edit3 size={18} />
          </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
});

TodoItem.displayName = 'TodoItem';

export default TodoItem;