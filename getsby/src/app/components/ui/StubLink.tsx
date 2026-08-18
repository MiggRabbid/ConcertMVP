import React from "react";
import type { AnchorHTMLAttributes, PropsWithChildren } from "react";

type StubLinkProps = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>;

export function StubLink({ children, onClick, ...props }: StubLinkProps) {
  return (
    <a
      href="#"
      {...props}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
