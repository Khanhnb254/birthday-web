import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "Happy Birthday 🎉",
  description: "Trang web chúc mừng sinh nhật",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
