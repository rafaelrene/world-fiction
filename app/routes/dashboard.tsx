import type { LoaderFunction, MetaFunction } from "@remix-run/node";

import { NavLink, Outlet } from "@remix-run/react";

import { requireUser } from "~/helpers/authRoute.server";

export const meta: MetaFunction = () => ({
  title: "Dashboard [World Fiction]",
});

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request);

  return null;
};

export default function DashboardIndex() {
  return (
    <main className="flex flex-col gap-2 items-center">
      <section className="bg-slate-700 w-full px-2 flex gap-2">
        <NavLink to="stories">Stories</NavLink>
        <NavLink to="chapters">Chapters</NavLink>
      </section>
      <Outlet />
    </main>
  );
}
