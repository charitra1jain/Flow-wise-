import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { FitbitProvider } from "@/lib/fitbit/fitbit-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { ChatProvider } from "@/components/chat-provider"
import ChatEventListener from "@/components/chat-event-listener"
import PopupChatbot from "@/components/popup-chatbot"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FlowWise - Menstrual Health Education",
  description: "Educational platform for menstrual health and wellness",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <FitbitProvider>
              <ChatProvider>
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <PopupChatbot />
                <ChatEventListener>
                  <Toaster />
                </ChatEventListener>
              </ChatProvider>
            </FitbitProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
