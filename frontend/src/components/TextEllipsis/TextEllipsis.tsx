import React, {
  useEffect,
  useState,
  useRef,
  FormEvent,
  ReactElement,
} from "react";

import { useClientScreen } from "src/hooks";

import classNames from "classnames";
import "./TextEllipsis.scss";

type Props = {
  children: React.ReactNode;
  lines?: number;
  isNotExpandable?: boolean;
  isButtonString?: boolean;
};

function TextEllipsis({
  children,
  lines = 1,
  isNotExpandable = false,
  isButtonString = false,
}: Props): ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);

  const { screenWidth } = useClientScreen();

  const toggleViewMore = (e: FormEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkCanBeExpanded = (element: HTMLDivElement): void => {
      if (isNotExpandable) {
        return;
      }

      setIsExpanded(false);
      const clone = element?.cloneNode(true) as HTMLElement;
      clone.classList.add("text-ellipsis--expanded");
      clone.classList.add("text-ellipsis--checker");
      const insertedNode = element?.parentNode?.insertBefore(clone, element);
      if (clone.clientHeight > element.clientHeight) {
        setIsExpandable(true);
      } else {
        setIsExpandable(false);
      }
      clone.remove();
      insertedNode?.remove();
    };
    checkCanBeExpanded(el.current as HTMLDivElement);
  }, [children, el, screenWidth, isNotExpandable]);

  return (
    <div>
      <div
        ref={el}
        className={classNames("text-ellipsis", {
          "text-ellipsis--expanded": isExpanded,
          "text-ellipsis--expandable": isExpandable,
        })}
        style={{
          WebkitLineClamp: `${lines}`,
          display: `${lines >= 1 ? "-webkit-box" : undefined}`,
        }}
      >
        {children}
      </div>
      {isExpandable && (
        <button
          className={classNames("text-ellipsis__button", {
            "text-ellipsis__button--string": isButtonString,
          })}
          onClick={toggleViewMore}
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
}

export default TextEllipsis;
