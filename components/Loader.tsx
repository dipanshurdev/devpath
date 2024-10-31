import React, { CSSProperties } from "react";
import { HashLoader } from "react-spinners";

type Props = {
  color?: string;
  loading?: boolean;
};

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

const Loader = ({ color = "#1e40af", loading = false }: Props) => {
  return (
    <div
      className="w-full flex items-center justify-center p-4
     m-4
     "
    >
      <HashLoader
        color={color}
        loading={loading}
        cssOverride={override}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
