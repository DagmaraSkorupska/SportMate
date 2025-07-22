"use client";

import AppButton from "@/components/AppButton";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-4xl font-bold mb-4">ZagrajMy 🏃‍♂️🎾</h1>
        <p className="text-lg text-gray-600 mb-6">
          Aplikacja w trakcie budowy – wróć wkrótce!
        </p>

        <AppButton
          variant="contained"
          tw="bg-primary text-white hover:bg-gray-800"
          onClick={() => router.push("/auth")}
        >
          Zaloguj się
        </AppButton>
      </div>
    </main>
  );
}
