import { useState } from "react";
import classNames from "classnames";
import DropDownCss from "src/components/DropDownCss";
import Sticker from "src/components//Sticker";
import CheckBox from "src/components/FormFields/CheckBox";
import VirtualScroll from "src/components/VirtualScroll";

interface OptionInterface {
  title: string;
  value: string;
  onClick: () => void;
}

const ItemRenderer =
  (selectedOptions: string[]) =>
  ({
    item,
    index,
    activeIndex,
    onMouseEnter,
  }: {
    item: OptionInterface;
    onMouseEnter: () => void;
    index: number;
    activeIndex: number;
  }) => {
    const { value, title, onClick } = item;
    return (
      <div
        onMouseEnter={onMouseEnter}
        key={value}
        style={{ padding: "8px" }}
        className={classNames("v-scroll__item", {
          "v-scroll__item--active": activeIndex === index,
        })}
      >
        <CheckBox
          onChange={onClick}
          name={`control__${value}`}
          label={title}
          fieldType="checkbox"
          value={`${selectedOptions.includes(`${value}`)}`}
        />
      </div>
    );
  };

const DropDownsPage: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionClick = (value: string) => () => {
    setSelectedOptions((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const menuOptions = [
    {
      title: "Option A",
      value: "a",
      onClick: handleOptionClick("a"),
    },
    {
      title: "Option B",
      value: "c",
      onClick: handleOptionClick("b"),
    },
    {
      title: "Option C",
      value: "c",
      onClick: handleOptionClick("c"),
    },
  ];

  const longList = Array.from({ length: 1000 }, (_, index) => ({
    title: `Option ${index}`,
    value: index,
    onClick: handleOptionClick(index.toString()),
  }));

  return (
    <div style={{ padding: "20px" }}>
      <div>
        <DropDownCss isPrimary options={menuOptions}>
          Menu button
        </DropDownCss>
      </div>

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          display: "inline-block",
        }}
      >
        <DropDownCss isPrimary options={menuOptions}>
          Wrapper overflow hidden
        </DropDownCss>
      </div>

      <div
        style={{
          transform: "translate(100px, 0)",
          overflow: "hidden",
          display: "inline-block",
          right: 0,
        }}
      >
        <DropDownCss isPrimary options={menuOptions}>
          Wrapper position absolute
        </DropDownCss>
      </div>

      <div
        style={{
          position: "absolute",
          overflow: "hidden",
          display: "inline-block",
          right: 0,
        }}
      >
        <DropDownCss isPrimary options={menuOptions}>
          Wrapper position absolute
        </DropDownCss>
      </div>

      <VirtualScroll items={longList} />

      <VirtualScroll
        items={longList}
        CMP={ItemRenderer(selectedOptions)}
      ></VirtualScroll>

      <Sticker initialPosition={{ bottom: 0, right: 0 }}>
        <div style={{ padding: "20px", width: "150px" }}>
          <DropDownCss isPrimary options={menuOptions}>
            ···
          </DropDownCss>
          <br />
          <small>
            Drag element any where to check how dropdown position reflect
          </small>
        </div>
      </Sticker>
    </div>
  );
};

export default DropDownsPage;
