export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className=" rounded-xl min-h-screen  w-full ">{children}</section>
  );
}
