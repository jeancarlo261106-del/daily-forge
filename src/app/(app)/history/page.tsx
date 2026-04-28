import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCalendarData } from "@/actions/protein";
import HistoryClient from "@/components/history/HistoryClient";

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const calendar = await getCalendarData(year, month);

  return (
    <HistoryClient
      initialCalendar={calendar}
      initialYear={year}
      initialMonth={month}
    />
  );
}
