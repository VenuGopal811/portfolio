import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Developer Workspace",
  description: "A technical portfolio workspace.",
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <noscript>
          <div className="no-script">JavaScript is required to enter this interactive workspace. The portfolio content will be available when the workspace is enabled.</div>
        </noscript>
      </body>
    </html>
  );
}
