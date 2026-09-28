"use client";

import { AuthWrapper } from "../components/pages/auth-wrapper";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
      <p className="mt-4 text-lg">This page is coming soon!</p>
    </div>
  );
}

export default function HomePage() {
  return <AuthWrapper Page={Home} />;
}
