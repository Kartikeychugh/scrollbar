import { useCallback, useMemo, useRef, useState } from "react";
import { debouncer } from "../../tools/debounce";
import { translateClientToScrollDistance } from "../../utils/scroll-distance.utils";

export const useScrollbar = () => {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const debounceRef = useRef(debouncer());

  const [scrolling, setScrolling] = useState(false);
  const [clientHeight, setClientHeight] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const attachScrollbarNode = useAttachScrollbarNodeCallback(
    node,
    setNode,
    setClientHeight,
    setScrollHeight,
    setScrollTop,
    setScrolling,
    debounceRef
  );

  const scrollbarThumbHeight = useMeasureScrollbarThumb(
    clientHeight,
    scrollHeight
  );

  const scrollbarThumbTravel = useMeasureScrollarThumbTravel(
    clientHeight,
    scrollHeight,
    scrollbarThumbHeight,
    scrollTop
  );

  const scrollTo = useScrollTo(node, clientHeight, scrollHeight);
  const scrollBy = useScrollBy(node, scrollHeight, clientHeight);

  return {
    attachScrollbarNode,
    scrollTo,
    scrollBy,
    scrolling,
    scrollbarThumbHeight,
    scrollbarThumbTravel,
  };
};

const useAttachScrollbarNodeCallback = (
  node: HTMLElement | null,
  setNode: React.Dispatch<React.SetStateAction<HTMLElement | null>>,
  setClientHeight: React.Dispatch<React.SetStateAction<number>>,
  setScrollHeight: React.Dispatch<React.SetStateAction<number>>,
  setScrollTop: React.Dispatch<React.SetStateAction<number>>,
  setScrolling: React.Dispatch<React.SetStateAction<boolean>>,
  debounceRef: React.MutableRefObject<(func: () => void, delay: number) => void>
) => {
  const scrollEventListener = useCallback(
    (e: Event) => {
      setScrolling(true);
      setScrollTop((e.target as Element).scrollTop);
      debounceRef.current(() => {
        setScrolling(false);
      }, 2000);
    },
    [debounceRef, setScrollTop, setScrolling]
  );

  const resizeObserver = useMemo(
    () =>
      new ResizeObserver((entries: ResizeObserverEntry[]) => {
        setClientHeight(entries[0].contentRect.height);
      }),
    [setClientHeight]
  );

  const attachRef = useCallback(
    (el: HTMLElement | null) => {
      if (el) {
        el.addEventListener("scroll", scrollEventListener);
        resizeObserver.observe(el);
        setClientHeight(el.clientHeight);
        setScrollHeight(el.scrollHeight);
      } else {
        if (node) {
          node.removeEventListener("scroll", scrollEventListener);
          resizeObserver.disconnect();
        }
      }
      setNode(el);
    },
    [
      node,

      resizeObserver,
      setNode,
      setClientHeight,
      setScrollHeight,
      scrollEventListener,
    ]
  );

  return attachRef;
};

const useMeasureScrollbarThumb = (clientHeight: number, scrollHeight: number) =>
  useMemo(
    () =>
      scrollHeight
        ? Math.floor((clientHeight * clientHeight) / scrollHeight)
        : 0,
    [clientHeight, scrollHeight]
  );

const useMeasureScrollarThumbTravel = (
  clientHeight: number,
  scrollHeight: number,
  scrollbarThumbHeight: number,
  scrollTop: number
) =>
  useMemo(
    () =>
      scrollHeight !== 0
        ? Math.floor(
            ((clientHeight - scrollbarThumbHeight) /
              (scrollHeight - clientHeight)) *
              scrollTop
          )
        : 0,
    [clientHeight, scrollHeight, scrollbarThumbHeight, scrollTop]
  );

const useScrollTo = (
  node: HTMLElement | null,
  clientHeight: number,
  scrollHeight: number
) =>
  useCallback(
    (movementY: number) => {
      if (node && clientHeight !== 0) {
        node.scrollTo({
          top: translateClientToScrollDistance(
            movementY,
            clientHeight,
            scrollHeight
          ),
        });
      }
    },
    [node, scrollHeight, clientHeight]
  );

const useScrollBy = (
  node: HTMLElement | null,
  scrollHeight: number,
  clientHeight: number
) =>
  useCallback(
    (movementY: number) => {
      if (node) {
        node?.scrollBy({
          top: translateClientToScrollDistance(
            movementY,
            clientHeight,
            scrollHeight
          ),
        });
      }
    },
    [node, scrollHeight, clientHeight]
  );
