import type { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "YouTube Sensei - AI Video Analysis",
  description: "Get deep insights and sentiment analysis from YouTube videos using Gemini AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <div className={styles.backgroundContainer}>
          <div className={styles.blobBlue}></div>
          <div className={styles.blobPurple}></div>
        </div>
        {children}
      </body>
    </html>
  );
}
