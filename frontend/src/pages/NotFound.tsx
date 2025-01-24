import { useState } from "react";

import { getUrl, IDENTIFIERS, Link } from "src/services/urlsHelper";
import Buttons from "src/components/Buttons/Buttons";
import { useIsAuthenticated } from "src/hooks";
import SignIn from "src/components/SignIn";

export const NotFound: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const [showSignInModal, setShowSignInModal] = useState(false);
  return (
    <div className="mx-auto max-w-7xl px-2 py-4 sm:px-6 lg:px-8 break-all">
      <h2>Page you are looking for is not found</h2>
      <Link to={getUrl(IDENTIFIERS.HOME)}>Go Home Page</Link>
      {!isAuthenticated && (
        <>
          <br />
          <Buttons isBordered onClick={() => setShowSignInModal(true)}>
            Login
          </Buttons>
        </>
      )}
      {showSignInModal && <SignIn onClose={() => setShowSignInModal(false)} />}
    </div>
  );
};

export default NotFound;
