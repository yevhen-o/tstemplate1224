import React, {
  Fragment,
  ReactElement,
  ReactNode,
  useRef,
  useState,
} from "react";

import Buttons from "src/components/Buttons";
import DropDown from "src/components/DropDown";

type ButtonProps = Parameters<typeof Buttons>[0];

type Props = ButtonProps & {
  id?: string;
  menuItems: {
    disabled?: boolean;
    onClick: () => void;
    title: string;
    [x: string | number | symbol]: unknown;
  }[];
  children?: ReactNode;
  onClick?: () => void;
  isWidthFixed?: boolean;
};

function MenuButton({
  id,
  menuItems,
  children,
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
          itemHeight={30}
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

export default MenuButton;
