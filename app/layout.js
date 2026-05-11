export const metadata = {
  title: 'B00 Study Hub',
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}

