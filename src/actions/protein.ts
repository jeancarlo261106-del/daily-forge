"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTodayString, getLastNDays, getShortDayLabel } from "@/lib/utils";
import type {
  DailyProgress,
  WeeklyDataPoint,
  CalendarDay,
} from "@/types/index";
import { revalidatePath } from "next/cache";

export async function addProteinEntry(data: {
  amount: number;
  note?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado");

  if (data.amount <= 0 || data.amount > 500) {
    throw new Error("Quantidade inválida");
  }

  const today = getTodayString();

  await prisma.proteinEntry.create({
    data: {
      userId: session.user.id,
      amount: data.amount,
      note: data.note || null,
      date: today,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/history");
}

export async function deleteProteinEntry(entryId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado");

  // Ensure the entry belongs to the user
  const entry = await prisma.proteinEntry.findFirst({
    where: { id: entryId, userId: session.user.id },
  });

  if (!entry) throw new Error("Entrada não encontrada");

  await prisma.proteinEntry.delete({
    where: { id: entryId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/history");
}

export async function getDailyProgress(): Promise<DailyProgress> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado");

  const today = getTodayString();

  const [entries, profile] = await Promise.all([
    prisma.proteinEntry.findMany({
      where: { userId: session.user.id, date: today },
      orderBy: { loggedAt: "desc" },
    }),
    prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    }),
  ]);

  const target = profile?.proteinTarget ?? 140;
  const consumed = entries.reduce((sum, e) => sum + e.amount, 0);
  const percentage = Math.min(Math.round((consumed / target) * 100), 100);

  return {
    consumed: Math.round(consumed),
    target,
    percentage,
    entries: entries.map((e) => ({
      id: e.id,
      amount: e.amount,
      note: e.note,
      loggedAt: e.loggedAt,
    })),
  };
}

export async function getWeeklyData(): Promise<WeeklyDataPoint[]> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado");

  const days = getLastNDays(7);

  const [entries, profile] = await Promise.all([
    prisma.proteinEntry.findMany({
      where: {
        userId: session.user.id,
        date: { in: days },
      },
    }),
    prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    }),
  ]);

  const target = profile?.proteinTarget ?? 140;

  // Group entries by date
  const byDate = new Map<string, number>();
  for (const entry of entries) {
    byDate.set(entry.date, (byDate.get(entry.date) ?? 0) + entry.amount);
  }

  return days.map((date) => ({
    date,
    dayLabel: getShortDayLabel(date),
    consumed: Math.round(byDate.get(date) ?? 0),
    target,
  }));
}

export async function getCalendarData(
  year: number,
  month: number
): Promise<CalendarDay[]> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado");

  // Get all entries for the given month
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endMonth = month === 12 ? 1 : month + 1;
  const endYear = month === 12 ? year + 1 : year;
  const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;

  const [entries, profile] = await Promise.all([
    prisma.proteinEntry.findMany({
      where: {
        userId: session.user.id,
        date: { gte: startDate, lt: endDate },
      },
    }),
    prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    }),
  ]);

  const target = profile?.proteinTarget ?? 140;

  // Group by date
  const byDate = new Map<string, number>();
  for (const entry of entries) {
    byDate.set(entry.date, (byDate.get(entry.date) ?? 0) + entry.amount);
  }

  // Generate all days of the month
  const daysInMonth = new Date(year, month, 0).getDate();
  const calendarDays: CalendarDay[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const consumed = Math.round(byDate.get(dateStr) ?? 0);
    const percentage = target > 0 ? Math.round((consumed / target) * 100) : 0;

    calendarDays.push({
      date: dateStr,
      consumed,
      target,
      percentage,
    });
  }

  return calendarDays;
}

export async function getWeeklyAverage(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado");

  const days = getLastNDays(7);

  const entries = await prisma.proteinEntry.findMany({
    where: {
      userId: session.user.id,
      date: { in: days },
    },
  });

  const total = entries.reduce((sum, e) => sum + e.amount, 0);
  return Math.round(total / 7);
}
