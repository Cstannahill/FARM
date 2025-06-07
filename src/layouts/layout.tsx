import "../index.css";
import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import CopyPageButton from "../components/CopyPageButton";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 p-6 prose lg:prose-lg dark:prose-invert max-w-none">
          <div className="flex justify-end">
            <CopyPageButton />
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
