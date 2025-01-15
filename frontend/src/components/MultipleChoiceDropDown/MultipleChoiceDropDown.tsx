import { Fragment, ReactElement, ReactNode, useRef, useState } from "react";

import Buttons from "src/components/Buttons";
import DropDown from "src/components/DropDown";
import { OptionType } from "src/Types/FormTypes";
import MultipleChoiceItem from "./MultipleChoiceItem";

type ButtonProps = Parameters<typeof Buttons>[0];

type Props = ButtonProps & {
  id?: string;
  menuItems: (OptionType & {
    disabled?: boolean;
    onClick: () => void;
  })[];
  value?: string | number | Array<string | number>;
  children?: ReactNode;
  onClick?: () => void;
  isWidthFixed?: boolean;
};

function MultipleChoiceDropDown({
  id,
  menuItems,
  children,
  value,
  onClick,
  isWidthFixed,
  ...restProps
}: Props): ReactElement {
  const menuWrapperEl = useRef<HTMLButtonElement>(null);
  const [isDropDownShown, setIsDropDownShown] = useState(false);

  const handleOpen = (): void => {
    onClick?.();
    setIsDropDownShown(true);
  };

  const handleClose = (): void => {
    setIsDropDownShown(false);
  };

  return (
    <Fragment>
      <Buttons {...restProps} onClick={handleOpen} ref={menuWrapperEl}>
        {children}
      </Buttons>
      {isDropDownShown && menuWrapperEl?.current && (
        <DropDown
          id={id}
          CMP={MultipleChoiceItem}
          itemHeight={30}
          value={value}
          menuItems={menuItems}
          withCloseOnSelect={true}
          repositionOnscroll={true}
          handleClose={handleClose}
          isWidthFixed={!!isWidthFixed}
          menuWrapperEl={menuWrapperEl?.current}
        />
      )}
    </Fragment>
  );
}

export default MultipleChoiceDropDown;
