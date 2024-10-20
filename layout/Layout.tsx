import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default Layout;
