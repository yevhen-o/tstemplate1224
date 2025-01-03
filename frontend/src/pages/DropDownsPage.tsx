import { useState } from "react";
import DropDownCss from "src/components/DropDownCss";
import Sticker from "src/components//Sticker";

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
