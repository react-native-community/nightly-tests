import {
  Arrow,
  Content,
  Portal,
  Provider,
  Root,
  type TooltipContentProps,
  type TooltipProps,
  Trigger,
} from '@radix-ui/react-tooltip';
import { type ReactNode } from 'react';

type Props = TooltipProps & {
  content?: ReactNode;
  side?: TooltipContentProps['side'];
  sideOffset?: TooltipContentProps['sideOffset'];
};

export default function Tooltip({ children, content, side = 'top', sideOffset = 1, delayDuration = 0 }: Props) {
  return (
    <Provider>
      <Root delayDuration={delayDuration}>
        <Trigger asChild>{children}</Trigger>
        <Portal>
          <Content
            className="z-20 max-w-[220px] rounded-md bg-black/90 px-2.5 py-1.5 text-center text-xs font-light text-white backdrop-blur-lg dark:bg-black/60"
            sideOffset={sideOffset}
            side={side}>
            {content}
            <Arrow />
          </Content>
        </Portal>
      </Root>
    </Provider>
  );
}
