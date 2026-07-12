import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold uppercase tracking-[-0.02em]">
        New post
      </h1>
      <PostForm />
    </div>
  );
}
