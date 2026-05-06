import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Андрей Борзов — стратегические отчёты для рекламных и медиа-холдингов",
  description:
    "Готовлю глубокие стратегические отчёты для CEO рекламных, медийных и adtech-компаний. От рынка и конкурентов — до плана действий и обоснования инвестиций.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,wght@0,300;0,400;0,500;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
