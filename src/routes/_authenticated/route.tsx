import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";
import { isTrustedDevice } from "@/lib/admin-gate";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: () => {
    // Anyone who is not on the owner's trusted device gets a plain 404.
    if (!isTrustedDevice()) throw notFound();
  },
  component: () => <Outlet />,
});
