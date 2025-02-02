export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="bg-gradient-page rounded-xl min-h-screen my-8 w-full ">
      {children}
    </section>
  );
}
