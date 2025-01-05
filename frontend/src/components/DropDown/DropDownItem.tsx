import classNames from "classnames";
import TextEllipsis from "src/components/TextEllipsis";

interface DropDownItemProps {
  id: string;
  index: number;
  value: (string | number)[];
  activeIndex: number;
  handleClose: () => void;
  handleClick: (
    fn: () => void
  ) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isItemSelected: (
    itemValue: string | number,
    value: (string | number)[]
  ) => boolean;
  item: {
    href?: string;
    label: string;
    style?: React.CSSProperties;
    target?: string;
    onClick?: () => void;
    disabled?: boolean;
    isDivider?: boolean;
    className?: string;
    value: string | number;
  };
}

const DropDownItem: React.FC<DropDownItemProps> = ({
  id,
  index,
  value,
  activeIndex,
  handleClose,
  handleClick = (
    fn: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  ) => fn,
  isItemSelected = (i: string | number, v: Array<string | number>) => false,
  item: {
    href,
    label,
    style,
    target,
    onClick = () => {},
    disabled,
    isDivider,
    className = "",
    value: itemValue,
  },
}) => {
  if (isDivider) {
    return <div className={"drop-down__divider"} />;
  }

  if (href) {
    return (
      <a
        href={href}
        style={style}
        target={target}
        onClick={handleClose}
        className={classNames("drop-down__item", className, {
          "drop-down__item--active": activeIndex === index,
          "drop-down__item--disabled": disabled,
          "drop-down__item--selected": isItemSelected(itemValue, value),
        })}
      >
        <span className="drop-down__item-text">
          <TextEllipsis>{label}</TextEllipsis>
        </span>
      </a>
    );
  }

  return (
    <button
      key={index}
      style={style}
      disabled={disabled}
      data-focus-parent={id}
      onClick={handleClick(onClick)}
      className={classNames("drop-down__item", className, {
        "drop-down__item--active": activeIndex === index,
        "drop-down__item--disabled": disabled,
        "drop-down__item--selected": isItemSelected(itemValue, value),
      })}
    >
      <span className={"drop-down__item-text"}>
        <TextEllipsis>{label}</TextEllipsis>
      </span>
    </button>
  );
};

export default DropDownItem;
