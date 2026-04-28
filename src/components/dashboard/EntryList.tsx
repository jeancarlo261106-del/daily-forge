"use client";

import { motion } from "framer-motion";
import { formatTime } from "@/lib/utils";
import { deleteProteinEntry } from "@/actions/protein";
import { useTransition } from "react";
import type { ProteinEntryData } from "@/types/index";

interface EntryListProps {
  entries: ProteinEntryData[];
}

export default function EntryList({ entries }: EntryListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteProteinEntry(id);
    });
  };

  if (entries.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-3xl mb-2">🍽️</p>
        <p
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Nenhum registro hoje. Toque no <strong>+</strong> para começar!
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <h3
        className="text-sm font-semibold mb-4"
        style={{ color: "var(--text-secondary)" }}
      >
        Registros de hoje
      </h3>
      <div className="space-y-2">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between p-3 rounded-xl transition-all group"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="text-lg font-bold tabular-nums shrink-0"
                style={{ color: "var(--accent-green)" }}
              >
                {entry.amount}g
              </span>
              {entry.note && (
                <span
                  className="text-sm truncate"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {entry.note}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className="text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                {formatTime(entry.loggedAt)}
              </span>
              <button
                onClick={() => handleDelete(entry.id)}
                disabled={isPending}
                className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                style={{
                  background: "rgba(255, 69, 58, 0.1)",
                  color: "var(--accent-red)",
                }}
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
