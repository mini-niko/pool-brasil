import routes from "@/infra/routes";
import useUser from "./useUser";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function RouterProtector({ children }) {
  const { isLoading, user } = useUser();
  const pathname = usePathname();
  const { push } = useRouter();

  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    if (isLoading || !user) return;

    const hasAnyAcess = user.features.some((feature) =>
      checkForAccess(pathname, feature),
    );

    if (hasAnyAcess) return setShowPage(true);

    const routeToRedirect = routes.private[user.features[0]].principal;
    push(routeToRedirect);
  }, [isLoading, user, pathname]);

  return (
    <>
      {!showPage && null}
      {showPage && children}
    </>
  );
}

export function checkForAccess(rawPathname, role) {
  const pathname = "/" + rawPathname.split("/")[1];

  const routesForRole = routes.private[role]?.routes;

  if (!routesForRole) return false;

  return routesForRole.includes(pathname);
}
