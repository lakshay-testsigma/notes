import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandPalette, SearchTrigger } from "@/components/command-palette";
import { DOMAINS } from "@/lib/domains";
import { getAllTopics } from "@/lib/content";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: { default: "Notes", template: "%s · Notes" },
  description: "Visual-first learning notes — grasp a topic in seconds.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(1 0 0)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.145 0 0)" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const topics = getAllTopics();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_-10%,--theme(--color-primary/5%),transparent)]"
          />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
          >
            Skip to content
          </a>
          <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-3 px-4 sm:px-6">
              <Link
                href="/"
                className="font-serif text-xl font-semibold tracking-tight"
              >
                Notes
              </Link>
              <div className="ml-auto flex items-center gap-1.5">
                <SearchTrigger variant="header" />
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main id="main" className="flex flex-1 flex-col">
            {children}
          </main>
          <footer className="border-t">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:px-6">
              <p>
                <span className="font-serif text-base text-foreground">Notes</span> — a
                visual-first learning notebook
              </p>
              <nav aria-label="Domains" className="flex flex-wrap gap-x-4 gap-y-1 sm:ml-auto">
                {DOMAINS.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/${d.slug}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {d.label}
                  </Link>
                ))}
              </nav>
            </div>
          </footer>
          <CommandPalette topics={topics} />
        </ThemeProvider>
      </body>
    </html>
  );
}
