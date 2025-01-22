import classNames from "classnames";
import TextEllipsis from "src/components/TextEllipsis";

interface MultipleChoiceItemProps {
  id?: string;
  index: number;
  value?: (string | number)[];
  activeIndex: number;
  handleClose: () => void;
  handleClick?: (
    fn: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  ) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isItemSelected?: (
    itemValue: string | number,
    value: (string | number)[]
  ) => boolean;
  item: {
    href?: string;
    label: string;
    style?: React.CSSProperties;
    target?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    disabled?: boolean;
    isDivider?: boolean;
    className?: string;
    value: string | number;
  };
}

const MultipleChoiceItem: React.FC<MultipleChoiceItemProps> = ({
  id,
  index,
  value,
  activeIndex,
  handleClick,
  isItemSelected,
  item: {
    label,
    style,
    onClick,
    disabled,
    isDivider,
    className = "",
    value: itemValue,
  },
}) => {
  if (isDivider) {
    return <div className={"drop-down__divider"} />;
  }

  return (
    <button
      key={index}
      style={style}
      disabled={disabled}
      data-focus-parent={id}
      onClick={!!handleClick && !!onClick ? handleClick(onClick) : undefined}
      className={classNames("drop-down__item", className, {
        "drop-down__item--active": activeIndex === index,
        "drop-down__item--disabled": disabled,
      })}
    >
      <span className={"inline-flex items-center gap-2"}>
        <input
          type="checkbox"
          name={label}
          readOnly
          checked={value && isItemSelected && isItemSelected(itemValue, value)}
        />
        <TextEllipsis>{label}</TextEllipsis>
      </span>
    </button>
  );
};

export default MultipleChoiceItem;
