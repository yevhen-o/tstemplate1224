import classNames from "classnames";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Button from "src/components/Buttons";
import SignIn from "src/components/SignIn/Signin";
import { getUrl, IDENTIFIERS, Link } from "src/services/urlsHelper";

type ListItemType = {
  to: string;
  children: React.ReactNode;
};
const ListItem: React.FC<ListItemType> = ({ to, children }) => {
  const location = useLocation();
  return (
    <li
      className={classNames({
        "relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white":
          location.pathname !== to,
        "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium":
          location.pathname === to,
      })}
    >
      <Link to={to}>{children}</Link>
    </li>
  );
};

function RootLayout() {
  const [showSignInModal, setShowSignInModal] = useState(false);
  return (
    <>
      <div>
        <header>
          <nav className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <ul className="relative flex h-16 items-center justify-start gap-2">
                <ListItem to={getUrl(IDENTIFIERS.HOME)}>Home</ListItem>
                <ListItem to={getUrl(IDENTIFIERS.TODOS)}>Todos</ListItem>
                <ListItem to={getUrl(IDENTIFIERS.ORGANIZATION_LIST)}>
                  Organization
                </ListItem>
                <ListItem to={getUrl(IDENTIFIERS.DROP_DOWNS)}>
                  Dropdowns
                </ListItem>
                <li className={classNames("ml-auto")}>
                  <Button isPrimary onClick={() => setShowSignInModal(true)}>
                    Sign In
                  </Button>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        <div>
          <Outlet />
        </div>
      </div>
      {showSignInModal && <SignIn onClose={() => setShowSignInModal(false)} />}
    </>
  );
}

export default RootLayout;
