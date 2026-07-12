import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold uppercase tracking-[-0.02em]">
        New project
      </h1>
      <ProjectForm />
    </div>
  );
}
