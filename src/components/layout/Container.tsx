import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function Container({
  children,
  className = "",
  as = "div",
}: ContainerProps) {
  const Component = as as any;
  return (
    <Component className={`mx-auto w-full max-w-7xl px-6 md:px-12 ${className}`}>
      {children}
    </Component>
  );
}
