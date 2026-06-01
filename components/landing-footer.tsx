"use client";

import { PiPath } from "react-icons/pi";
import { LuGithub, LuTwitter, LuInstagram, LuLinkedin, LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import Link from "next/link";

const footerLinks = {
  product: [
    { label: "Roadmaps", href: "/roadmaps" },
    { label: "Pricing", href: "/pricing" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "mailto:dipanshurdev@gmail.com" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export default function LandingFooter() {
  return (
    <footer className="mt-32 border-t border-border/40 bg-gradient-to-b from-muted/30 via-card/20 to-muted/20 backdrop-blur-sm dark:from-card/40 dark:via-background dark:to-card/30">
      <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
          {/* Logo & Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
                <PiPath className="text-primary-foreground w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">DevPath</span>
            </Link>
            <p className="max-w-xs text-sm font-medium leading-relaxed text-muted-foreground">
              The ultimate SaaS platform for developer roadmaps. Navigate your career with precision and master the latest technologies.
            </p>
            
            {/* Social Links */}
            <div className="mt-6">
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-foreground">Follow Us</h3>
              <div className="flex space-x-3">
                <a
                  href="https://github.com/dipanshurdev/devpath"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-card transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:bg-primary/10 hover:shadow-lg"
                >
                  <LuGithub size={18} className="text-foreground" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a
                  href="https://twitter.com/dipanshurdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-card transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:bg-primary/10 hover:shadow-lg"
                >
                  <LuTwitter size={18} className="text-foreground" />
                  <span className="sr-only">Twitter</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="mb-6 text-xs font-black uppercase tracking-widest text-foreground">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <LuMail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <a href="mailto:dipanshurdev@gmail.com" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    dipanshurdev@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <LuMapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Location</p>
                  <p className="text-sm text-muted-foreground">India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Links Groups */}
          <div>
            <h3 className="mb-6 text-xs font-black uppercase tracking-widest text-foreground">
              Product
            </h3>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground underline-offset-4 transition-all hover:text-primary hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="mb-6 text-xs font-black uppercase tracking-widest text-foreground">
              Company
            </h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground underline-offset-4 transition-all hover:text-primary hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-border/40 pt-10 md:flex-row">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} DevPath. Built with care for developers.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-tighter text-primary/70 dark:text-primary/80">
              SaaS Edition v2.0
            </p>
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_12px_hsl(142_76%_45%)]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
