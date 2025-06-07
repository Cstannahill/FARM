"use client";
import { Link } from "@radix-ui/react-navigation-menu";
import docs from "../../../docs-site/docs.json";

const nav = [
  { href: "/", label: "Introduction" },
  { href: "/guide/getting-started", label: "Getting Started" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 p-6 border-r hidden md:block">
      <h1 className="font-bold text-xl mb-4">{docs.title}</h1>
      <nav className="space-y-2">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block hover:underline"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
