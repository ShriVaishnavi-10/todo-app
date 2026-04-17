"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function Login() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background p-6 overflow-hidden">
      {/* Soft Rose Glows */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="stealth-card p-10 flex flex-col items-center rounded-[2.5rem] border-accent/20"
        >
          <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-accent/30 rotate-3">
             <ShieldCheck className="text-white w-10 h-10" />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight mb-2">Momentum Portal</h1>
            <p className="text-sm text-muted">Authenticate to enter Momentum.</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 h-14 bg-accent text-white font-medium px-8 rounded-xl transition-all shadow-lg shadow-accent/20"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 brightness-200 contrast-200"
            />
            <span>Connect Identity</span>
          </motion.button>
          
          <div className="mt-12 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Protected Access</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
