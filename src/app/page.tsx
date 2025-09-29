import { AIImageGenerator } from "@/components/ai-image-generator";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <AIImageGenerator />
    </main>
  );
}

