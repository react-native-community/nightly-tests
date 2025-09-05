import {
  Provider,
  Root,
  Trigger,
  Portal,
  Content,
  Arrow,
  type TooltipProps,
  type TooltipContentProps,
} from "@radix-ui/react-tooltip";
import { type ReactNode } from "react";

type Props = TooltipProps & {
  content?: ReactNode;
  side?: TooltipContentProps["side"];
  sideOffset?: TooltipContentProps["sideOffset"];
};

export default function Tooltip({
  children,
  content,
  side = "top",
  sideOffset = 1,
  delayDuration = 0,
}: Props) {
  return (
    <Provider>
      <Root delayDuration={delayDuration}>
        <Trigger asChild>{children}</Trigger>
        <Portal>
          <Content
            className="bg-black px-2.5 py-1 rounded-md text-xs text-white max-w-[220px] text-center"
            sideOffset={sideOffset}
            side={side}
          >
            {content}
            <Arrow />
          </Content>
        </Portal>
      </Root>
    </Provider>
  );
}
