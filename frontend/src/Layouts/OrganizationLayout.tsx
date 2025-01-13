import { useParams } from "react-router";
import classNames from "classnames";
import { Outlet, useLocation } from "react-router-dom";
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

function OrganizationLayout() {
  const { organizationId } = useParams<{ organizationId: string }>();
  return (
    <div>
      <header>
        <h1>Organizations</h1>
        <nav className="bg-gray-800">
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <ul className="relative flex h-16 items-center justify-between">
              <ListItem to={getUrl(IDENTIFIERS.ORGANIZATION_LIST)}>
                Back to list
              </ListItem>
              {!!organizationId && (
                <>
                  <ListItem
                    to={getUrl(IDENTIFIERS.ORGANIZATION_VIEW, {
                      organizationId,
                    })}
                  >
                    Overview
                  </ListItem>
                  <ListItem
                    to={getUrl(IDENTIFIERS.ORGANIZATION_MEMBERS, {
                      organizationId,
                    })}
                  >
                    Members
                  </ListItem>
                  <ListItem
                    to={getUrl(IDENTIFIERS.ORGANIZATION_PROJECTS, {
                      organizationId,
                    })}
                  >
                    Projects
                  </ListItem>
                </>
              )}
            </ul>
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default OrganizationLayout;
