import { useDragNDrop } from "../../hooks";
import "./scrollbar-thumb.css";

interface IScrollbarThumbProps {
  scrollbarThumbTravel: number;
  scrollbarThumbHeight: number;
  scrollBy?: (movementX: number) => void;
}

export const ScrollbarThumb = (props: IScrollbarThumbProps) => {
  const { scrollbarThumbTravel, scrollbarThumbHeight, scrollBy } = props;
  const { attachDragNDropNode } = useDragNDrop(scrollBy);

  return (
    <div
      className="scrollbar-thumb"
      ref={attachDragNDropNode}
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={{
        position: "relative",
        top: `${scrollbarThumbTravel}px`,
        background: "darkgrey",
        height: scrollbarThumbHeight,
      }}
    ></div>
  );
};
