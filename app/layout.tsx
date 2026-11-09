import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catlink",
  description: "Seus links, sua identidade. Crie sua página com o Catlink.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Reference font is shared via the App Router root layout; local fonts will be evaluated separately. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 font-sans min-h-screen selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
