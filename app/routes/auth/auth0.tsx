import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { redirect } from "@remix-run/node";

import { authenticator } from "~/services/auth.server";

export const loader: LoaderFunction = () => redirect("/auth/login");

export const action: ActionFunction = ({ request }) => {
  return authenticator.authenticate("auth0", request);
};
