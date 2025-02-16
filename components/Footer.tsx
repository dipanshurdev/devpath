"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  // LuFacebook,
  LuTwitter,
  LuInstagram,
  LuLinkedin,
  // LuMail,
  LuGithub,
} from "react-icons/lu";

export default function Footer() {
  const pathname = usePathname();
  const backgroundClass =
    pathname === "/" ? "bg-primaryDark mt-10" : "bg-transparent mt-20";
  return (
    <footer className={`${backgroundClass} text-primaryWhite py-12 `}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">
              DevPath is an interactive roadmap platform for developers,
              offering structured learning paths, resources, and guides to
              master technical skills.
            </p>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-primaryBlue  transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmaps"
                  className="hover:text-primaryBlue  transition-colors"
                >
                  Roadmaps
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-primaryBlue  transition-colors"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-primaryBlue  transition-colors"
                >
                  About
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/contact"
                  className="hover:text-primaryBlue  transition-colors"
                >
                  Contact
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Contact Us
            </h3>
            <address className="not-italic text-sm">
              <p>Email: kr7102956@gmail.com</p>
            </address>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/dipanshurdev/devpath"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primaryBlue  transition-colors"
              >
                <LuGithub size={24} />
                <span className="sr-only">Gihub</span>
              </a>
              <a
                href="https://twitter.com/dipanshurdev"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primaryBlue  transition-colors"
              >
                <LuTwitter size={24} />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://instagram.com/dipanshurdev"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primaryBlue  transition-colors"
              >
                <LuInstagram size={24} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://linkedin.com/in/dipanshurdev"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primaryBlue  transition-colors"
              >
                <LuLinkedin size={24} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} DevPath. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
