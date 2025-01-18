import { useNavigate } from "react-router-dom";

import { useActions } from "src/hooks";
import Button from "src/components/Buttons";
import { getUrl, IDENTIFIERS } from "src/services/urlsHelper";

export const UserSettings: React.FC = () => {
  const { logoutAll } = useActions();
  const navigate = useNavigate();

  const handleLogoutAll = async () => {
    await logoutAll({});
    navigate(getUrl(IDENTIFIERS.HOME));
  };

  return (
    <div className="mx-auto max-w-7xl px-2 py-4 sm:px-6 lg:px-8">
      <h2>
        Logout from all devices:{" "}
        <Button onClick={handleLogoutAll} isBordered>
          Log out
        </Button>
      </h2>
    </div>
  );
};
