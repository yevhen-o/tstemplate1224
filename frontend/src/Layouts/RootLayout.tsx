import classNames from "classnames";
import { useEffect, useState } from "react";
import { Settings } from "src/components/Icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Button from "src/components/Buttons";
import SignIn from "src/components/SignIn";
import SignUp from "src/components/SignUp";
import MenuButton from "src/components/MenuButton";
import { useActions, useTypedSelector, useIsAuthenticated } from "src/hooks";
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
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const { init, logout } = useActions();
  const navigate = useNavigate();
  const initState = useTypedSelector((state) => state.user.init);

  useEffect(() => {
    init({});
  }, [init]);

  const { isFetched, isFetching } = initState;

  const handleLogout = async () => {
    await logout({});
    navigate(getUrl(IDENTIFIERS.HOME));
  };

  const userOptions = [
    {
      label: "Settings",
      value: "settings",
      onClick: () => {},
      href: getUrl(IDENTIFIERS.USER_SETTINGS),
    },
    {
      label: "Log out",
      value: "logout",
      onClick: handleLogout,
    },
  ];

  return (
    <>
      {isFetching && <>Loading...</>}
      {isFetched && (
        <div>
          <header>
            <nav className="bg-gray-800">
              <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <ul className="relative flex h-16 items-center justify-start gap-2">
                  <ListItem to={getUrl(IDENTIFIERS.HOME)}>Home</ListItem>
                  <ListItem to={getUrl(IDENTIFIERS.TODOS)}>Todos</ListItem>
                  <ListItem to={getUrl(IDENTIFIERS.DROP_DOWNS)}>
                    Dropdowns
                  </ListItem>
                  {!isAuthenticated && (
                    <li className={classNames("ml-auto gap-2 flex")}>
                      <Button
                        isPrimary
                        onClick={() => setShowSignInModal(true)}
                      >
                        Sign In
                      </Button>
                      <Button
                        isBordered
                        onClick={() => setShowSignUpModal(true)}
                      >
                        Sign Up
                      </Button>
                    </li>
                  )}
                  {isAuthenticated && (
                    <>
                      <ListItem to={getUrl(IDENTIFIERS.ORGANIZATION_LIST)}>
                        Organizations
                      </ListItem>
                      <li className={classNames("ml-auto")}>
                        <MenuButton
                          data-testId={"user-menu"}
                          menuItems={userOptions}
                        >
                          <Settings className="text-white" size="20" />
                        </MenuButton>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </nav>
          </header>
          <div>
            <Outlet />
          </div>
        </div>
      )}
      {showSignInModal && <SignIn onClose={() => setShowSignInModal(false)} />}
      {showSignUpModal && <SignUp onClose={() => setShowSignUpModal(false)} />}
    </>
  );
}

export default RootLayout;
