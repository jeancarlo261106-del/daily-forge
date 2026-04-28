import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getDailyProgress,
  getWeeklyData,
  getWeeklyAverage,
  getCalendarData,
} from "@/actions/protein";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const now = new Date();
  const calendarYear = now.getFullYear();
  const calendarMonth = now.getMonth() + 1;

  const [progress, weekly, average, calendar] = await Promise.all([
    getDailyProgress(),
    getWeeklyData(),
    getWeeklyAverage(),
    getCalendarData(calendarYear, calendarMonth),
  ]);

  const userName = session.user.name?.split(" ")[0] ?? "Usuário";

  return (
    <DashboardClient
      initialProgress={progress}
      initialWeekly={weekly}
      initialCalendar={calendar}
      initialAverage={average}
      userName={userName}
      calendarYear={calendarYear}
      calendarMonth={calendarMonth}
    />
  );
}
