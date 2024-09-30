  import React from "react";

  export default function MaterialIcon({
    iconName = "face",
    type = "outlined",
    className = "",
  }) {
    return (
      <i className="symbol">
        <span className={`material-symbols-${type} ${className}`}>
          {iconName}
        </span>
      </i>
    );
  }
