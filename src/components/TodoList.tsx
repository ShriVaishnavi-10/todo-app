"use client";

import React, { memo } from "react";
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';
import { motion, AnimatePresence } from 'framer-motion';

interface Todo {
  id: string;
  title: string;
  is_done: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (text: string) => void;
  onEdit: (id: string, newText: string) => void;
}

const TodoList = memo(({ todos, onToggle, onDelete, onAdd, onEdit }: TodoListProps) => {
  return (
    <div className="p-6 md:p-10">
      <div className="mb-10">
         <AddTodo onAdd={onAdd} />
      </div>
      
      <div className="space-y-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {todos.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-20 text-center border-2 border-dashed border-border rounded-3xl"
            >
              <div className="text-4xl mb-6 opacity-20">📂</div>
              <h2 className="text-lg font-bold text-foreground mb-1">Workspace Clear</h2>
              <p className="text-xs text-muted font-medium">Define your next objective above to begin.</p>
            </motion.div>
          ) : (
            todos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <TodoItem
                  todo={todo}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

TodoList.displayName = 'TodoList';

export default TodoList;