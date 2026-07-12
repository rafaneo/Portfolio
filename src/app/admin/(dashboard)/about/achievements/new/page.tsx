import { AchievementForm } from "@/components/admin/achievement-form";

export default function NewAchievementPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold uppercase tracking-[-0.02em]">
        New achievement
      </h1>
      <AchievementForm />
    </div>
  );
}
