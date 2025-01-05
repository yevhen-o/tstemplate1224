import { useState } from "react";
import classNames from "classnames";
import DropDownCss from "src/components/DropDownCss";
import Sticker from "src/components//Sticker";
import CheckBox from "src/components/FormFields/CheckBox";
import VirtualScroll from "src/components/VirtualScroll";
import MenuButton from "src/components/MenuButton";
import MultiSelect from "src/components/FormFields/MultiSelect";
import { OptionType } from "src/Types/FormTypes";

const ItemRenderer =
  (selectedOptions: Array<string | number>) =>
  ({
    item,
    index,
    activeIndex,
    onMouseEnter,
  }: {
    item: OptionType & { onClick: () => void };
    onMouseEnter: () => void;
    index: number;
    activeIndex: number;
  }) => {
    const { value, label, onClick } = item;
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
          label={label}
          fieldType="checkbox"
          value={`${selectedOptions.includes(`${value}`)}`}
        />
      </div>
    );
  };

const DropDownsPage: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<
    Array<string | number>
  >([]);

  const handleOptionClick = (value: string) => () => {
    setSelectedOptions((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const menuOptions = [
    {
      label: "Option A",
      value: "a",
      onClick: handleOptionClick("a"),
    },
    {
      label: "Option B",
      value: "b",
      onClick: handleOptionClick("b"),
    },
    {
      label: "Option C",
      value: "c",
      onClick: handleOptionClick("c"),
    },
  ];

  const longList = Array.from({ length: 1000 }, (_, index) => ({
    label: `Option ${index}`,
    value: index,
    onClick: handleOptionClick(index.toString()),
  }));

  return (
    <div style={{ padding: "20px" }}>
      <div>
        <DropDownCss isPrimary options={menuOptions}>
          Menu button css
        </DropDownCss>
        <MenuButton isBordered menuItems={menuOptions}>
          Menu button
        </MenuButton>
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
        <MenuButton isBordered menuItems={menuOptions}>
          Menu button
        </MenuButton>
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
        <MenuButton isBordered menuItems={menuOptions}>
          Menu button
        </MenuButton>
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
        <MenuButton isBordered menuItems={menuOptions}>
          Menu button
        </MenuButton>
      </div>

      <VirtualScroll items={longList} />

      <VirtualScroll
        items={longList}
        CMP={ItemRenderer(selectedOptions)}
      ></VirtualScroll>
      <div style={{ display: "flex", gap: "var(--spacer-xl)" }}>
        <MultiSelect
          value={selectedOptions}
          isMultiple
          fieldType="multiSelect"
          name="custom-name"
          options={menuOptions}
          isCloseOnSelect
          onChange={(e) => {
            Array.isArray(e) && setSelectedOptions(e);
          }}
        />
        <MultiSelect
          value={selectedOptions}
          isMultiple
          fieldType="multiSelect"
          name="custom-name"
          options={longList}
          isCloseOnSelect
          isSearchable
          onChange={(e) => {
            Array.isArray(e) && setSelectedOptions(e);
          }}
        />
      </div>

      <Sticker initialPosition={{ bottom: 0, right: 0 }}>
        <div style={{ padding: "20px", width: "150px" }}>
          <DropDownCss isPrimary options={menuOptions}>
            ···
          </DropDownCss>
          <MenuButton isBordered menuItems={menuOptions}>
            ···
          </MenuButton>
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
