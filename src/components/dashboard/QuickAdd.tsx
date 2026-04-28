"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addProteinEntry } from "@/actions/protein";
import { QUICK_FOODS } from "@/lib/protein";

interface QuickAddProps {
  onAdded?: () => void;
}

export default function QuickAdd({ onAdded }: QuickAddProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Small delay to let the animation start before focusing
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    startTransition(async () => {
      await addProteinEntry({ amount: val, note: note || undefined });
      setAmount("");
      setNote("");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsOpen(false);
        onAdded?.();
      }, 1000);
    });
  };

  const handleQuickFood = (protein: number, foodName: string) => {
    startTransition(async () => {
      await addProteinEntry({ amount: protein, note: foodName });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsOpen(false);
        onAdded?.();
      }, 1000);
    });
  };

  return (
    <>
      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center text-3xl font-light shadow-2xl z-40"
        style={{
          background: "var(--accent-blue)",
          color: "white",
          boxShadow: "0 4px 30px rgba(10, 132, 255, 0.4)",
        }}
      >
        +
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isPending && setIsOpen(false)}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(5px)" }}
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:w-full"
            >
              <div className="glass-strong p-6 rounded-3xl">
                <AnimatePresence mode="wait">
                  {showSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="text-center py-8"
                    >
                      <span className="text-6xl">✅</span>
                      <p
                        className="text-lg font-semibold mt-3"
                        style={{ color: "var(--accent-green)" }}
                      >
                        Registrado!
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div key="form">
                      <div className="flex items-center justify-between mb-5">
                        <h3
                          className="text-lg font-bold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Registrar Proteína
                        </h3>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            background: "var(--bg-card)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          ✕
                        </button>
                      </div>

                      {/* Manual Input */}
                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="flex gap-3">
                          <input
                            ref={inputRef}
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Gramas de proteína"
                            className="input-glass flex-1"
                            min="0.1"
                            max="500"
                            step="0.1"
                          />
                          <button
                            type="submit"
                            disabled={isPending || !amount}
                            className="btn-primary"
                            style={{ width: "auto", padding: "0.75rem 1.5rem" }}
                          >
                            {isPending ? "..." : "Adicionar"}
                          </button>
                        </div>
                        <input
                          type="text"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Observação (opcional)"
                          className="input-glass"
                        />
                      </form>

                      {/* Quick Foods */}
                      <div className="mt-5">
                        <p
                          className="text-xs font-semibold mb-3 uppercase tracking-wider"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          Adição Rápida
                        </p>
                        <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                          {QUICK_FOODS.map((food) => (
                            <motion.button
                              key={food.name}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleQuickFood(food.protein, food.name)
                              }
                              disabled={isPending}
                              className="p-2.5 rounded-xl text-left transition-all hover:scale-[1.02]"
                              style={{
                                background: "var(--bg-input)",
                                border: "1px solid var(--glass-border)",
                              }}
                            >
                              <p
                                className="text-xs truncate"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {food.name}
                              </p>
                              <p
                                className="text-sm font-bold mt-0.5"
                                style={{ color: "var(--accent-green)" }}
                              >
                                {food.protein}g
                              </p>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
