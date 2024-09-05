import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function SimpleBackdrop({ open = false }) {
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
