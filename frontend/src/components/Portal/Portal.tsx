import { ReactNode } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  children: ReactNode;
};

const Portal: React.FC<PortalProps> = ({ children }) => {
  return createPortal(children, document.body);
};

export default Portal;
