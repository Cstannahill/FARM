import { NavLink } from "react-router-dom";
import docs from "../../docs-site/docs.json";


interface NavItem {
  title: string
  path: string
}

export default function Sidebar() {
  return (
    <aside className="w-64 p-6 border-r hidden md:block">
      <div className="mb-4 space-y-2">
        <h1 className="font-bold text-xl">{docs.title}</h1>
        <input
          type="search"
          placeholder="Search..."
          className="w-full border rounded px-2 py-1 text-sm"
        />
        <button className="text-xs text-muted-foreground">⌘K Ask AI</button>
      </div>
      <nav className="space-y-2">
        {(docs.nav as NavItem[]).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block hover:underline ${isActive ? 'font-semibold' : ''}`
            }
          >
            {item.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
