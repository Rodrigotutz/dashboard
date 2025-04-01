import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import { BsGithub } from "react-icons/bs";

type NavLink = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

export default function Navbar() {
  const pathname = usePathname();

  const centerLinks: NavLink[] = [
    { href: "/", label: "Inicio" },
    { href: "/dicas", label: "Dicas" },
    { href: "/noticias", label: "Noticias" },
  ];

  const rightLinks: NavLink[] = [
    {
      href: "https://github.com",
      label: "",
      icon: <BsGithub className="h-5 w-5" />,
    },
    {
      href: "/login",
      label: "",
      icon: <LogIn className="h-5 w-5" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <nav className="sticky top-0 z-50 w-full md:bg-neutral-800 text-white md:border-b border-neutral-200">
      <div className="flex md:mx-20 h-16 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="hidden md:flex items-center gap-2"
          prefetch={false}
        >
          <span className="text-xl font-bold">Sistema</span>
        </Link>

        <section className="hidden md:flex items-center gap-6 text-sm font-medium mx-auto">
          {centerLinks.map((link, index) => (
            <Link
              key={`center-${index}`}
              href={link.href}
              className={`transition-colors ${link.icon ? "flex items-center gap-1" : ""}
                ${isActive(link.href) ? "text-white" : "text-neutral-400 hover:text-white"}
              `}
              prefetch={false}
            >
              {link.icon && <span>{link.icon}</span>}
              {link.label}
            </Link>
          ))}
        </section>

        <div className="hidden md:flex items-center gap-6">
          {rightLinks.map((link, index) => (
            <Link
              key={`right-${index}`}
              href={link.href}
              className={`transition-colors ${link.icon ? "flex items-center gap-1" : ""}
                ${isActive(link.href) ? "text-white" : "text-neutral-400 hover:text-white"}
              `}
              prefetch={false}
            >
              {link.icon && <span>{link.icon}</span>}
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
