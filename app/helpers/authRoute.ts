import type { User } from "~/types";

import { redirect } from "@remix-run/node";

import { authenticator } from "~/services/auth.server";

export const requireUser = async (request: Request): Promise<User> => {
  const user: User | null = await authenticator.isAuthenticated(request);

  if (user === null) {
    throw redirect("/auth/login");
  }

  return user;
};
