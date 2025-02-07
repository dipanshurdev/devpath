export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="bg-gradient-page rounded-xl min-h-screen  w-full ">
      {children}
    </section>
  );
}
