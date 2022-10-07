import React from "react";
import { PropsWithChildren } from "react";
import { useScrollbar } from "../../hooks";
import { ScrollbarTrack } from "../scrollbar-track";

interface IScrollbarProps {
  style?: React.CSSProperties | undefined;
}

export const Scrollbar = (props: PropsWithChildren<IScrollbarProps>) => {
  const {
    attachScrollbarNode,
    scrollTo,
    scrollBy,
    scrolling,
    scrollbarThumbHeight,
    scrollbarThumbTravel,
  } = useScrollbar();

  return (
    <div style={{ display: "flex", width: "100%", ...props.style }}>
      <div
        ref={attachScrollbarNode}
        style={{ overflowY: "scroll", width: "100%" }}
        className="scrollbar-hidden"
      >
        {props.children}
      </div>
      <ScrollbarTrack
        {...(scrollTo ? { onClick: scrollTo } : {})}
        scrolling={scrolling}
        width={5}
        scrollBy={scrollBy}
        scrollbarThumbHeight={scrollbarThumbHeight}
        scrollbarThumbTravel={scrollbarThumbTravel}
      />
    </div>
  );
};
