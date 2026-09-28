"use client";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex-col mt-5">
      <main className="">{children}</main>
    </div>
  );
}