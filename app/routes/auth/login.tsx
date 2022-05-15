import type { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

export const meta: MetaFunction = () => ({ title: "Login [World Fiction]" });

export default function Login() {
  return (
    <Form action="/auth/auth0" method="post">
      <button>Login with Auth0</button>
    </Form>
  );
}
