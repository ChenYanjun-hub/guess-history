import type { Metadata } from "next";
import "@/styles/theme.css";

export const metadata: Metadata = {
  title: "猜历史人物",
  description: "AI 驱动的多人实时问答游戏",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=ZCOOL+XiaoWei&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased relative">
        {children}
      </body>
    </html>
  );
}
