import classNames from "classnames";
import { ComponentType } from "react";
import VirtualizedList from "./VirtualScroll";
import "./VirtualScroll.scss";

const ListItem = ({
  index,
  activeIndex,
  item,
  onMouseEnter,
}: {
  index: number;
  activeIndex: number;
  item: any;
  onMouseEnter: () => void;
}) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      style={{
        backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#ffffff",
      }}
      className={classNames("v-scroll__item", {
        "v-scroll__item--active": activeIndex === activeIndex + index,
      })}
    >
      {item.title}
    </div>
  );
};

interface VirtualScroll {
  items: any[];
  itemHeight?: number;
  extraItems?: number;
  CMP?: ComponentType<any>;
  handleClick?: (callback?: () => void) => void;
  handleClose?: () => void;
}

const VirtualScrollWrapper: React.FC<VirtualScroll> = ({
  items,
  CMP,
  handleClick,
  handleClose,
  itemHeight = 40,
  extraItems = 20,
}) => {
  const RenderComponent = CMP ? CMP : ListItem;

  return (
    <VirtualizedList
      items={items}
      itemHeight={itemHeight}
      extraItems={extraItems}
      handleClick={handleClick}
      handleClose={handleClose}
      CMP={RenderComponent}
      visibleSpace={Math.min(itemHeight * items.length, 370)}
    />
  );
};

export default VirtualScrollWrapper;
