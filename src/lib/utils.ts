import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/** Retorna a data atual no formato "YYYY-MM-DD" */
export function getTodayString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

/** Formata data para exibição (ex: "28 de abril") */
export function formatDateDisplay(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date + "T12:00:00") : date;
  return format(d, "d 'de' MMMM", { locale: ptBR });
}

/** Formata hora para exibição (ex: "14:30") */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "HH:mm");
}

/** Retorna saudação baseada na hora atual */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

/** Retorna cor baseada na porcentagem de progresso */
export function getProgressColor(percentage: number): string {
  if (percentage >= 100) return "#30D158"; // verde
  if (percentage >= 70) return "#0A84FF"; // azul
  if (percentage >= 40) return "#FF9F0A"; // laranja
  return "#FF453A"; // vermelho
}

/** Retorna os últimos N dias como strings "YYYY-MM-DD" */
export function getLastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(format(d, "yyyy-MM-dd"));
  }
  return days;
}

/** Retorna label curto do dia da semana (ex: "Seg") */
export function getShortDayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return format(d, "EEE", { locale: ptBR });
}
