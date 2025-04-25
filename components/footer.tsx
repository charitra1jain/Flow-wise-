import Link from "next/link"
import { Instagram, Twitter, Facebook, Youtube, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-flowwise-mint/20 dark:bg-flowwise-burgundy/10 py-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-flowwise-burgundy to-flowwise-red flex items-center justify-center text-white font-bold">
                F
              </div>
              <h3 className="text-lg font-bold gradient-text">FlowWise</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering everyone with knowledge about menstrual health and wellness.
            </p>
            <div className="flex space-x-3">
              <Link href="#" className="text-flowwise-pink hover:text-flowwise-red transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-flowwise-pink hover:text-flowwise-red transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-flowwise-pink hover:text-flowwise-red transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-flowwise-pink hover:text-flowwise-red transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3 text-flowwise-burgundy dark:text-flowwise-pink">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/learn" className="text-muted-foreground hover:text-flowwise-red transition-colors">
                  Educational Content
                </Link>
              </li>
              <li>
                <Link href="/chatbot" className="text-muted-foreground hover:text-flowwise-red transition-colors">
                  AI Chatbot
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="text-muted-foreground hover:text-flowwise-red transition-colors">
                  Symptom Tracker
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="text-muted-foreground hover:text-flowwise-red transition-colors">
                  Fitness Integrations
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3 text-flowwise-burgundy dark:text-flowwise-pink">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-flowwise-red transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-flowwise-red transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-flowwise-red transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/myths" className="text-muted-foreground hover:text-flowwise-red transition-colors">
                  Myth Busters
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3 text-flowwise-burgundy dark:text-flowwise-pink">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-flowwise-red transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-flowwise-red transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-flowwise-red transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-flowwise-red transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-flowwise-lightPink/20 pt-6">
          <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
            © {new Date().getFullYear()} FlowWise. Made with{" "}
            <Heart className="h-3 w-3 text-flowwise-red fill-flowwise-red" /> for menstrual health education.
          </p>
        </div>
      </div>
    </footer>
  )
}
