import classNames from "classnames";
import { ComponentType } from "react";
import VirtualizedList from "./VirtualScroll";
import "./VirtualScroll.scss";
import { OptionType } from "src/Types/FormTypes";

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
      {item.label}
    </div>
  );
};

interface VirtualScroll {
  id?: string;
  items: OptionType[];
  value?: any; // TODO: Fix usage of any here
  itemHeight?: number;
  extraItems?: number;
  hasActiveByDefault?: boolean;
  isItemSelected?: (itemValue: string, newValue: string | string[]) => void;
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