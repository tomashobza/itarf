"use client";

import React from "react";

const variantClasses = {
  primary: "bg-rose-300",
  secondary: "bg-rose-50",
  success: "bg-green-300",
  warning: "bg-yellow-300",
};

function Button({
  onClick = () => {},
  children,
  variant = "primary",
  bgColor,
}: {
  onClick?: () => void;
  children?: React.ReactNode;
  variant?: keyof typeof variantClasses;
  bgColor?: string;
}) {
  const backgroundColor = bgColor || variantClasses[variant];

  return (
    <button
      className={`${backgroundColor} cursor-pointer border-2 border-black rounded-lg py-2 px-3 shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000] transition-all duration-100 flex items-center justify-center`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
