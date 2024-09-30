"use client";
import React from "react";
import useUser from "./../../../hook/useUser";
import MenuAppBar from "../../../components/general/MenuAppBar";

export default function Layout({ children }) {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated()) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }

  return (
    <>
      <main>
        <MenuAppBar title="Informacion usuario" />
        {children}
      </main>
    </>
  );
}
