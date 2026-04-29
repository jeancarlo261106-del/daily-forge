import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const TIMEZONE = "America/Sao_Paulo";

/**
 * Retorna a data/hora atual no fuso de São Paulo.
 * Isso garante que tanto no servidor (UTC) quanto no cliente,
 * "hoje" sempre corresponda ao dia correto no Brasil.
 */
export function getNowBR(): Date {
  const nowUTC = new Date();
  // Formata a data no fuso BR e reconstrói como Date local
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(nowUTC);

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "0";

  return new Date(
    Number(get("year")),
    Number(get("month")) - 1,
    Number(get("day")),
    Number(get("hour")),
    Number(get("minute")),
    Number(get("second"))
  );
}

/** Retorna a data atual (fuso BR) no formato "YYYY-MM-DD" */
export function getTodayString(): string {
  return format(getNowBR(), "yyyy-MM-dd");
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

/** Retorna saudação baseada na hora atual (fuso BR) */
export function getGreeting(): string {
  const hour = getNowBR().getHours();
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

/** Retorna os últimos N dias como strings "YYYY-MM-DD" (fuso BR) */
export function getLastNDays(n: number): string[] {
  const days: string[] = [];
  const now = getNowBR();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
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
