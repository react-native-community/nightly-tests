import {
  Provider,
  Root,
  Trigger,
  Portal,
  Content,
  Arrow,
  type TooltipProps,
} from "@radix-ui/react-tooltip";
import { type ReactNode } from "react";

type Props = TooltipProps & {
  content?: ReactNode;
};

export default function Tooltip({ children, content, delayDuration }: Props) {
  return (
    <Provider>
      <Root delayDuration={delayDuration}>
        <Trigger asChild>{children}</Trigger>
        <Portal>
          <Content
            className="bg-black px-2.5 py-1 rounded-md text-xs text-white"
            sideOffset={0}
          >
            {content}
            <Arrow />
          </Content>
        </Portal>
      </Root>
    </Provider>
  );
}
