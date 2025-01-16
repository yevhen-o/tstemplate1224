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
        "bg-gray-200 rounded hover:bg-gray-300 cursor-pointer":
          location.pathname !== to,
        "bg-gray-400 rounded hover:bg-gray-300 cursor-pointer":
          location.pathname === to,
      })}
    >
      <Link className="p-2 w-full block" to={to}>
        {children}
      </Link>
    </li>
  );
};

function OrganizationLayout() {
  const { organizationId } = useParams<{ organizationId: string }>();
  return (
    <div className="flex h-screen">
      {/* Left Menu Section */}
      <div className="bg-gray-100 flex-shrink-0 w-full max-w-[360px] min-w-[200px] overflow-y-auto border-r border-gray-300">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Menu</h2>
          <ul className="space-y-2">
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
      </div>

      {/* Right Main Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default OrganizationLayout;
