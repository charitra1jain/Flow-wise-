import Link from "next/link"
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-pink-600 dark:text-pink-400">FlowWise</h3>
            <p className="text-sm text-muted-foreground">
              Empowering everyone with knowledge about menstrual health and wellness.
            </p>
            <div className="flex space-x-3">
              <Link href="#" className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/learn" className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400">
                  Educational Content
                </Link>
              </li>
              <li>
                <Link href="/chatbot" className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400">
                  AI Chatbot
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400">
                  Symptom Tracker
                </Link>
              </li>
              <li>
                <Link
                  href="/integrations"
                  className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400"
                >
                  Fitness Integrations
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/myths" className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400">
                  Myth Busters
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} FlowWise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
