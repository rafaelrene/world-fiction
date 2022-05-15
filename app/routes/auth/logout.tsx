import type { ActionFunction, MetaFunction } from "@remix-run/node";

import { Form } from "@remix-run/react";

import { authenticator } from "~/services/auth.server";

export const meta: MetaFunction = () => ({ title: "Logout [World Fiction]" });

export const action: ActionFunction = ({ request }) => {
  return authenticator.logout(request, { redirectTo: "/" });
};

export default function Logout() {
  return (
    <Form method="post">
      <button>Logout with Auth0</button>
    </Form>
  );
}
