import type { User } from "~/types";

import { Authenticator } from "remix-auth";
import { Auth0Strategy } from "remix-auth-auth0";

import { sessionStorage } from "~/services/session.server";
import { db } from "~/services/db.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
    new Auth0Strategy(
        {
            callbackURL:
                process.env.AUTH0_CALLBACK_URL ??
                "http://localhost:3000/auth/callback",
            clientID:
                process.env.AUTH0_CLIENT_ID ??
                "bDZB5F3tFJuz7u5XhTVaDmEYHztEZueb",
            clientSecret:
                process.env.AUTH0_CLIENT_SECRET ??
                "zJqlOM_I4rtyKtjLSOIa9tc50LR17Xlw2zGkmF5bQaSGX0qcSTUFYcqc4OHjJqNH",
            domain: process.env.AUTH0_DOMAIN ?? "dev-ewzf9m9w.us.auth0.com",
        },
        async ({ profile }) => {
            const query = `
                    MERGE (u:User {id: $user.id, displayName: $user.displayName, email: $user.email, avatar: $user.avatar, locale: $user.locale})
                    RETURN u
                `;

            const user: User = {
                id: profile.id,
                displayName: profile.displayName,
                email: profile._json.email,
                avatar: profile._json.picture,
                locale: profile._json.locale,
            };

            const parameters = { user };

            await db(query, parameters);

            // Get the user data from your DB or API using the tokens and profile
            return user;
        }
    )
);
