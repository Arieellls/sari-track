"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

// eslint-disable-next-line react/display-name
const ScrollAreaScrollbarWithRef = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>((props, ref) => {
  return <ScrollAreaPrimitive.ScrollAreaScrollbar {...props} ref={ref} />;
});

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaScrollbarWithRef>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaScrollbarWithRef>
>((props, ref) => {
  const { className, orientation = "vertical", ...rest } = props;

  return (
    <ScrollAreaScrollbarWithRef
      {...rest} // Pass all other props
      ref={ref} // 'ref' is forwarded to the correct component
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical"
          ? "h-full w-2.5 border-l border-l-transparent p-[1px]"
          : "",
        orientation === "horizontal"
          ? "h-2.5 flex-col border-t border-t-transparent p-[1px]"
          : "",
        className
      )}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaScrollbarWithRef>
  );
});

ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };
