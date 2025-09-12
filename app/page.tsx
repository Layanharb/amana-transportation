import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <Image
        className="dark:invert"
        src="/next.svg"
        alt="Next.js logo"
        width={180}
        height={38}
        priority
      />
      <h1 className="text-4xl font-bold">Welcome to My App 🚀</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Edit <code className="font-mono">app/page.tsx</code> to get started.
      </p>
    </main>
  );
}
