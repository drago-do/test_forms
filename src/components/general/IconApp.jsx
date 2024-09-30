import Image from "next/image";
import React from "react";

export default function IconApp({ forceMode }) {
  if (forceMode == "dark") {
    return (
      <Image
        src="/logo_dark_bg.svg"
        className="my-3"
        alt="logo"
        width={200}
        height={30}
      />
    );
  }

  if (forceMode == "light") {
    return (
      <Image
        src="/logo_white_bg.svg"
        className="my-3"
        alt="logo"
        width={200}
        height={30}
      />
    );
  }

  return (
    <>
      <Image
        src="/logo_dark_bg.svg"
        className="hidden dark:block my-3"
        alt="logo"
        width={200}
        height={30}
      />
      <Image
        src="/logo_white_bg.svg"
        className="block dark:hidden  my-3"
        alt="logo"
        width={200}
        height={30}
      />
    </>
  );
}
