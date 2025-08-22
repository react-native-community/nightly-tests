import Link, { type LinkProps } from "next/link";
import { AnchorHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

import ExternalLinkIcon from "~/public/external-link-icon.svg";

type Props = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export default function InlineLink({
  children,
  className,
  target,
  href,
  ...rest
}: Props) {
  const computedTarget =
    (target ?? href?.startsWith("http")) ? "_blank" : undefined;
  return (
    <Link
      href={href}
      target={computedTarget}
      className={twMerge(
        "w-fit border-b border-b-transparent transition-[border] inline-flex gap-1 items-center",
        "hover:border-b-border",
        className,
      )}
      {...rest}
    >
      {children}
      {computedTarget === "_blank" && (
        <ExternalLinkIcon className="size-3.5 text-secondary/50" />
      )}
    </Link>
  );
}
