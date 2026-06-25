import {
  Outlet,
  createRootRoute,
  useNavigate,
  Link,
  useLocation,
} from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useConvexAuth } from "convex/react";
import type { ConvexReactClient } from "convex/react";
import { useEffect } from "react";
import { TbMoodPuzzled } from "react-icons/tb";

export interface RouterContext {
  convex: ConvexReactClient;
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => (
    <div className="h-screen w-screen flex flex-col gap-5 items-center justify-center">
      <div className="bg-grey/10 text-text p-4 rounded-xl">
        <TbMoodPuzzled size={32} />
      </div>
      <h2 className="text-xl">Page introuvable...</h2>
      <Link to="/" className="bg-green text-white p-4 rounded">
        Retourner à l'accueil
      </Link>
    </div>
  ),
});

function RootComponent() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      // Si l'utilisateur n'est pas authentifié et n'est pas sur /signin, rediriger vers /signin
      if (!isAuthenticated && location.pathname !== "/signin") {
        navigate({ to: "/signin" });
      }
      // Si l'utilisateur est authentifié et est sur /signin, rediriger vers /
      else if (isAuthenticated && location.pathname === "/signin") {
        navigate({ to: "/" });
      }
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen">
      <Outlet />
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </div>
  );
}
