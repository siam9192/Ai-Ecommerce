import Link from "next/link";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiGithub,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4">

        {/* Main Footer */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-white"
            >
              AI<span className="text-indigo-400">Shop</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              Your trusted destination for modern technology and premium
              digital products.
            </p>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                className="rounded-lg bg-slate-900 p-2.5 transition hover:bg-indigo-600 hover:text-white"
              >
                <FiFacebook size={18} />
              </a>

              <a
                href="#"
                className="rounded-lg bg-slate-900 p-2.5 transition hover:bg-indigo-600 hover:text-white"
              >
                <FiInstagram size={18} />
              </a>

              <a
                href="#"
                className="rounded-lg bg-slate-900 p-2.5 transition hover:bg-indigo-600 hover:text-white"
              >
                <FiTwitter size={18} />
              </a>

              <a
                href="#"
                className="rounded-lg bg-slate-900 p-2.5 transition hover:bg-indigo-600 hover:text-white"
              >
                <FiGithub size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white">Quick Links</h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="transition hover:text-indigo-400"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/products"
                  className="transition hover:text-indigo-400"
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="transition hover:text-indigo-400"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-indigo-400"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-white">Customer Service</h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  href="/shipping"
                  className="transition hover:text-indigo-400"
                >
                  Shipping & Delivery
                </Link>
              </li>

              <li>
                <Link
                  href="/returns"
                  className="transition hover:text-indigo-400"
                >
                  Returns & Refunds
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="transition hover:text-indigo-400"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="transition hover:text-indigo-400"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white">Get In Touch</h3>

            <div className="mt-5 space-y-4 text-sm">

              <div className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 shrink-0 text-indigo-400" size={18} />
                <span>
                  123 Tech Street,
                  <br />
                  Dhaka, Bangladesh
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FiPhone className="shrink-0 text-indigo-400" size={18} />
                <span>+880 1234-567890</span>
              </div>

              <div className="flex items-center gap-3">
                <FiMail className="shrink-0 text-indigo-400" size={18} />
                <span>support@aishop.com</span>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-3 border-t border-slate-800 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-500">
            © {new Date().getFullYear()} AIShop. All rights reserved.
          </p>

          <p className="text-slate-500">
            Built with ❤️ for modern shopping.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;