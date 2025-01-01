import React from "react";
import { useTypedSelector } from "src/hooks/useTypedSelector";
import { ClientScreenInterface } from "src/Types/ClientScreen";

export function withClientScreen<T extends Partial<ClientScreenInterface>>(
  Component: React.ComponentType<T>
) {
  return function ClientScreenWrapper(
    props: Omit<T, keyof ClientScreenInterface>
  ) {
    const storeClientScreen = useTypedSelector((store) => store.clientScreen);

    return (
      <Component
        {...(props as T)}
        {...(storeClientScreen as ClientScreenInterface)}
      />
    );
  };
}

export default withClientScreen;
