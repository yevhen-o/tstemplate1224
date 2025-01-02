import { useState } from "react";
import DropDownCss from "src/components/DropDownCss";
import Sticker from "src/components//Sticker";
import { withClientScreen } from "src/hocs";

const DropDownsPage: React.FC<{
  screenWidth: number;
  screenHeight: number;
}> = ({ screenHeight, screenWidth }) => {
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
    <div>
      <DropDownCss isPrimary options={menuOptions}>
        Menu button
      </DropDownCss>
      {screenWidth && screenHeight && (
        <Sticker
          initialPosition={{ top: screenHeight - 200, left: screenWidth - 150 }}
        >
          <div style={{ padding: "20px", width: "150px" }}>
            <DropDownCss isPrimary options={menuOptions}>
              ···
            </DropDownCss>
            Drag element any where to check how dropdown position reflect
          </div>
        </Sticker>
      )}
    </div>
  );
};

export default withClientScreen(DropDownsPage);
