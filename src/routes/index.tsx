import Header from "@/components/nav/Header";
import Navbar from "@/components/nav/Navbar";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuthenticated } = useConvexAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  } else {
    return <Navigate to="/feed" />;
  }
}
