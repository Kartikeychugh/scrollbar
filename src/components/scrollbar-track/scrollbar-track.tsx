import { useCallback, useRef, useState } from "react";
import { debouncer } from "../../tools/debounce";
import { ScrollbarThumb } from "../scrollbar-thumb";

import "./scrollbar-track.css";

interface IScrollbarTrackProps {
  width: number;
  scrollbarThumbTravel: number;
  scrollbarThumbHeight: number;
  scrolling: boolean;
  onClick?: (movementY: number) => void;
  scrollBy?: (movementY: number) => void;
}

export const ScrollbarTrack = (props: IScrollbarTrackProps) => {
  const [mouseOver, setMouseOver] = useState(false);
  const debounceRef = useRef(debouncer());

  const {
    width,
    scrollbarThumbTravel,
    scrollbarThumbHeight,
    onClick,
    scrollBy,
    scrolling,
  } = props;

  const scrollbarTrackOnClick = useScrollbarTrackOnClickCallback(
    onClick,
    scrollbarThumbTravel,
    scrollbarThumbHeight
  );

  const { scrollbarTrackOnHover, scrollbarTrackOnUnHover } =
    useMouseEventsCallback(debounceRef, setMouseOver);

  return (
    <div
      className="scrollbar-track"
      style={{ width }}
      onMouseOver={scrollbarTrackOnHover}
      onMouseOut={scrollbarTrackOnUnHover}
      onClick={scrollbarTrackOnClick}
      hidden={!(scrolling || (!scrolling && mouseOver))}
    >
      <ScrollbarThumb
        scrollBy={scrollBy}
        scrollbarThumbTravel={scrollbarThumbTravel}
        scrollbarThumbHeight={scrollbarThumbHeight}
      />
    </div>
  );
};

const useScrollbarTrackOnClickCallback = (
  onClick: ((movementY: number) => void) | undefined,
  scrollbarThumbTravel: number,
  scrollbarThumbHeight: number
) =>
  useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();

      if (onClick) {
        onClick(
          calculateScrollTop(e, scrollbarThumbTravel, scrollbarThumbHeight)
        );
      }
    },
    [onClick, scrollbarThumbHeight, scrollbarThumbTravel]
  );

const calculateScrollTop = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  scrollbarThumbTravel: number,
  scrollbarThumbHeight: number
) => {
  const layerY = calculateLayerY(e);
  let top = layerY;

  if (
    isClickBelowScrollThumb(layerY, scrollbarThumbTravel, scrollbarThumbHeight)
  ) {
    top = layerY - scrollbarThumbHeight;
  }

  return top;
};

const calculateLayerY = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  const offsetTop = e.currentTarget.parentElement
    ? e.currentTarget.parentElement.offsetTop
    : 0;

  return e.clientY - offsetTop;
};

const isClickBelowScrollThumb = (
  layerY: number,
  scrollbarThumbTravel: number,
  scrollbarThumbHeight: number
) => layerY > scrollbarThumbTravel + scrollbarThumbHeight;

const useMouseEventsCallback = (
  debounceRef: React.MutableRefObject<
    (func: () => void, delay: number) => void
  >,
  setMouseOver: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const scrollbarTrackOnHover = useCallback(() => {
    debounceRef.current(() => setMouseOver(true), 0);
  }, [debounceRef, setMouseOver]);

  const scrollbarTrackOnUnHover = useCallback(() => {
    debounceRef.current(() => {
      setMouseOver(false);
    }, 2000);
  }, [debounceRef, setMouseOver]);

  return { scrollbarTrackOnHover, scrollbarTrackOnUnHover };
};
