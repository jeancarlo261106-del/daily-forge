import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProfile } from "@/actions/profile";
import ProfileClient from "@/components/profile/ProfileClient";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { profile, user } = await getProfile();
  if (!profile) redirect("/onboarding");

  return (
    <ProfileClient
      profile={{
        weight: profile.weight,
        height: profile.height,
        age: profile.age,
        sex: profile.sex,
        activityLevel: profile.activityLevel,
        dietGoal: profile.dietGoal,
        proteinTarget: profile.proteinTarget,
      }}
      user={{
        name: user?.name ?? null,
        email: user?.email ?? null,
        image: user?.image ?? null,
      }}
    />
  );
}
