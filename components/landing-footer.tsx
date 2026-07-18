"use client";

import { PiPath } from "react-icons/pi";
import { LuGithub, LuTwitter, LuMail, LuMapPin } from "react-icons/lu";
import Link from "next/link";

const nav = {
  product: [
    { label: "Roadmaps", href: "/roadmaps" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Pricing", href: "/pricing" },
    { label: "Saved", href: "/saved" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "mailto:dipanshurdev@gmail.com" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export default function LandingFooter() {
  return (
    <footer className="border-t border-border/60 dark:border-zinc-800 bg-background">
      <div className="container-xl">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px border-b border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
          {/* Brand column */}
          <div className="bg-background lg:col-span-2 px-0 py-10 pr-10">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-8 h-8 bg-neutral-950 dark:bg-white flex items-center justify-center shrink-0">
                <PiPath className="text-white dark:text-neutral-950 w-4.5 h-4.5" />
              </div>
              <span className="text-base font-bold tracking-tight text-foreground dark:text-white group-hover:text-primary transition-colors">
                DevPath
              </span>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mb-6">
              Structured, interactive learning paths for software engineers. Navigate your career with precision.
            </p>

            {/* Contact items */}
            <div className="space-y-2.5">
              <a
                href="mailto:dipanshurdev@gmail.com"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors"
              >
                <LuMail size={13} />
                dipanshurdev@gmail.com
              </a>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <LuMapPin size={13} />
                India
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-6">
              {[
                { href: "https://github.com/dipanshurdev/devpath", icon: LuGithub, label: "GitHub" },
                { href: "https://twitter.com/dipanshurdev", icon: LuTwitter, label: "Twitter" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 border border-border/60 dark:border-zinc-700 text-muted-foreground hover:text-foreground dark:hover:text-white hover:border-border dark:hover:border-zinc-600 transition-colors"
                  aria-label={label}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div className="bg-background px-8 py-10">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-foreground dark:text-white mb-5">
              Product
            </h3>
            <ul className="space-y-3">
              {nav.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="bg-background px-8 py-10">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-foreground dark:text-white mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {nav.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-5">
          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} DevPath. Built by{" "}
            <a
              href="https://dipanshurdev.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground dark:text-white hover:text-primary transition-colors"
            >
              Dipanshu Rawat
            </a>
            .
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-muted-foreground">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
