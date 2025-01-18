import React, {
  useRef,
  useState,
  Fragment,
  forwardRef,
  PropsWithChildren,
  ForwardRefRenderFunction,
} from "react";
import classNames from "classnames";
import { nanoid } from "@reduxjs/toolkit";

import DropDown from "src/components/DropDown";
import FieldLabel from "src/components/FormFields/FieldLabel";
import { Close, ChevronDown, ChevronUp } from "src/components/Icons";

import { KEY_CODES } from "src/constants/";
import { checkValidity } from "src/helpers/validation";
import {
  DefaultFormProps,
  MultiSelectType,
  OptionType,
} from "src/Types/FormTypes";

import "./MultiSelect.scss";

type MultiSelectProps = DefaultFormProps & MultiSelectType;

const MultiSelect: ForwardRefRenderFunction<
  HTMLInputElement,
  PropsWithChildren<MultiSelectProps>
> = (
  {
    id = nanoid(),
    name,
    label,
    values = {},
    value,
    options,
    onChange,
    disabled,
    isBordered,
    helpText,
    tabIndex,
    isMultiple = false,
    rules = {},
    placeholder,
    isSearchable = false,
    formErrors = {},
    isCloseOnSelect = true,
  },
  ref // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  // TODO: combine ref
  const inputEl = useRef<HTMLInputElement>(null);
  const menuWrapperEl = useRef<HTMLButtonElement>(null);

  const [isTouched, setIsTouched] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isDropDownShown, setIsDropDownShown] = useState(false);
  const currentValues = (value ||
    values[name as keyof typeof values] ||
    []) as Array<string | number>;

  const onInputChange = (value: (string | number)[]) => {
    const { errorMessage } = checkValidity(
      value,
      rules[name as keyof typeof rules],
      values
    );
    onChange?.(value, { formErrors: { ...formErrors, [name]: errorMessage } });
    if (isCloseOnSelect) setIsDropDownShown(false);
  };

  const errorMessage = formErrors[name];
  const isValid = !errorMessage;

  const handleClose = () => {
    setIsTouched(true);
    setSearchText("");
    setIsDropDownShown(false);
  };

  const handleOpen = () => {
    inputEl.current?.focus();
    setIsDropDownShown(true);
  };

  const handleRemoveOption = (
    value: string | number,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    inputEl.current?.focus();
    onInputChange(currentValues.filter((v) => `${v}` !== `${value}`));
  };

  const onSelect = (option: OptionType, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setSearchText("");

    if (!isMultiple) {
      onInputChange([option.value]);
    } else {
      const updatedValues = currentValues.includes(option.value)
        ? currentValues.filter((v) => v !== option.value)
        : [...currentValues, option.value];
      onInputChange(updatedValues);
    }

    inputEl.current?.focus();
  };

  const getItemsToDisplay = () =>
    !searchText
      ? options
      : options.filter((opt) =>
          opt.label.toLowerCase().includes(searchText.toLowerCase())
        );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (!isDropDownShown && e.target.value.trim()) {
      setIsDropDownShown(true);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === KEY_CODES.BACK_SPACE && !searchText) {
      const newValue = [...currentValues];
      newValue.pop();
      onInputChange(newValue);
    }
  };

  return (
    <div
      className={classNames("select", {
        "select--bordered": isBordered,
      })}
    >
      <FieldLabel id={id} isValid={isValid || !isTouched}>
        {label}
      </FieldLabel>

      <button
        onClick={handleOpen}
        ref={menuWrapperEl}
        tabIndex={tabIndex}
        className={classNames("select__wrapper", {
          "select__wrapper--multiple": isMultiple,
          "select__wrapper--disabled": disabled,
          "select__wrapper--bordered": isBordered,
        })}
      >
        <div className="select__values-list">
          {currentValues.length ? (
            <Fragment>
              {isMultiple &&
                currentValues.map((value) => (
                  <div key={value} className="select__value">
                    {options.find((o) => o.value === value)?.label || value}
                    <div
                      role="button"
                      aria-label={`Unselect ${value}`}
                      onClick={(e) => handleRemoveOption(value, e)}
                      className="select__remove-item"
                    >
                      <Close size={20} />
                    </div>
                  </div>
                ))}
              {!isMultiple &&
                !searchText &&
                options.find((o) => o.value === currentValues[0])?.label}
            </Fragment>
          ) : (
            !isDropDownShown && (
              <small className="select__placeholder">
                {placeholder || "Select"}
              </small>
            )
          )}
          {isSearchable && options.length > 5 && (
            <input
              ref={inputEl}
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={handleKeyUp}
              className="select__input"
              size={Math.max(searchText.length + 1, 10)}
            />
          )}
        </div>

        <ArrowIcon isDropDownShown={isDropDownShown} />

        {isDropDownShown && menuWrapperEl.current && (
          <DropDown
            id={id}
            itemHeight={32}
            value={currentValues}
            searchText={searchText}
            handleClose={handleClose}
            repositionOnscroll={false}
            menuWrapperEl={menuWrapperEl.current}
            withCloseOnSelect={isCloseOnSelect}
            menuItems={getItemsToDisplay().map((o) => ({
              ...o,
              onClick: (e: React.MouseEvent) => onSelect(o, e),
            }))}
          />
        )}
      </button>

      {!isValid && errorMessage && isTouched && (
        <div className="mt-2 text-xs text-red-500">{errorMessage}</div>
      )}
      {helpText && !(isTouched && errorMessage) && (
        <div className="text-gray-500">{helpText}</div>
      )}
    </div>
  );
};

const ArrowIcon: React.FC<{ isDropDownShown: boolean }> = ({
  isDropDownShown,
}) => (
  <div className="select__arrow">
    {isDropDownShown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
  </div>
);

export default forwardRef(MultiSelect);
