import { useNavigate } from "react-router-dom";

import { useActions, useTypedSelector } from "src/hooks";
import Button from "src/components/Buttons";
import { getUrl, IDENTIFIERS } from "src/services/urlsHelper";
import { authorizedUserSelector } from "src/store/user/userSlice";

export const UserSettings: React.FC = () => {
  const { logoutAll, deleteAccount } = useActions();
  const navigate = useNavigate();

  const authorizedUser = useTypedSelector(authorizedUserSelector);

  const handleLogoutAll = async () => {
    await logoutAll({});
    navigate(getUrl(IDENTIFIERS.HOME));
  };
  const handleDeleteAccount = async () => {
    if (authorizedUser) {
      await deleteAccount({ userId: authorizedUser?.userId });
    }
    navigate(getUrl(IDENTIFIERS.HOME));
  };

  return (
    <div className="mx-auto max-w-7xl px-2 py-4 sm:px-6 lg:px-8 break-all">
      <h2>User Info</h2>
      {JSON.stringify(authorizedUser, null, 2)}
      <h2>Logout from all devices: </h2>
      <Button onClick={handleLogoutAll} isBordered>
        Log out
      </Button>
      <Button onClick={handleDeleteAccount}>Delete account</Button>
    </div>
  );
};

export default UserSettings;
