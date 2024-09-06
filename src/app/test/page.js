"use client";
import React, { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import useUser from "@/hook/useUser";

export default function SimpleBackdrop({ open = false }) {
  const {
    authenticateUser,
    getLoggedUserInfo,
    getSpecificUserFullInfo,
    updateUserInfo,
    logout,
    getAllUser,
    createNewUser,
    deleteUser,
    getUserRole,
    isAuthenticated,
  } = useUser();

  React.useEffect(() => {
    const testUserFunctions = async () => {
      try {
        console.log("Testing authentication...");
        const authResponse = await authenticateUser(
          "carlos.lopez@example.com",
          "hashedpassword123"
        );
        console.log("Authentication successful:", authResponse);

        console.log("Getting logged user info...");
        const userInfo = getLoggedUserInfo();
        console.log("Logged user info:", userInfo);

        console.log("Testing getSpecificUserFullInfo with ID 1...");
        const specificUserInfo = await getSpecificUserFullInfo(1);
        console.log("Specific user info:", specificUserInfo);

        console.log("Testing getUserRole...");
        const userRole = getUserRole();
        console.log("User role:", userRole);

        console.log("Testing getAllUser...");
        const allUsers = await getAllUser();
        console.log("All users:", allUsers);

        console.log("Testing createNewUser...");
        const newUser = await createNewUser({
          email: "new.user@example.com",
          password: "newpassword",
        });
        console.log("New user created:", newUser);

        console.log("Testing updateUserInfo with ID 1...");
        const updatedUser = await updateUserInfo(1, {
          email: "updated.user@example.com",
        });
        console.log("User updated:", updatedUser);

        console.log("Testing deleteUser with ID 1...");
        const deleteResponse = await deleteUser(1);
        console.log("User deleted:", deleteResponse);

        console.log("Testing logout...");
        logout();
        console.log("User logged out successfully.");
      } catch (error) {
        console.error("Error during testing:", error);
      }
    };

    testUserFunctions();
  }, [
    authenticateUser,
    getLoggedUserInfo,
    getSpecificUserFullInfo,
    updateUserInfo,
    logout,
    getAllUser,
    createNewUser,
    deleteUser,
    getUserRole,
  ]);

  return (
    <div>
      <Backdrop
        className="bg-black bg-opacity-50 z-50" // Tailwind classes for backdrop
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
