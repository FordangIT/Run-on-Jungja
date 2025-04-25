// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-center text-xs text-gray-600 py-4">
      문의:{" "}
      <a
        href="mailto:runonjungja@gmail.com"
        className="text-blue-600 hover:underline"
      >
        fordang0819@gmail.com
      </a>
      <div className="mt-2">
        <Link href="/about" className="hover:underline mx-2">
          About
        </Link>
        <span>|</span>
        <Link href="/privacy" className="hover:underline mx-2">
          Privacy Policy
        </Link>
      </div>
      <div className="mt-2 text-gray-400">
        © 2025 Run on Jungja. All rights reserved.
      </div>
    </footer>
  );
}
