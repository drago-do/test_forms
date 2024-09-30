"use client";
import React from "react";
import useUser from "./../../../hook/useUser";
import MenuAppBar from "../../../components/general/MenuAppBar";

export default function Layout({ children }) {
  const { getUserRole } = useUser();

  if (typeof window !== "undefined" && getUserRole() !== "Admin") {
    window.location.href = "/";
  }

  return (
    <>
      <main>
        <MenuAppBar title="Responder Test" />
        {children}
      </main>
    </>
  );
}
