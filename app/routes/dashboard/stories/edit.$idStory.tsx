import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { Story } from "~/types";

import { useLoaderData } from "@remix-run/react";

import { db } from "~/services/db.server";
import { requireUser } from "~/helpers/authRoute";

export const meta: MetaFunction = ({ data }) => ({
  title: `${data.title} - Edit [World Fiction]`,
});

export const loader: LoaderFunction = async ({ request, params }) => {
  if (params.idStory === undefined) {
    throw new Error("idStory must be provided!");
  }

  const user = await requireUser(request);

  const query = `
    MATCH (s:Story {id: $idStory})-[:CREATED_BY]->(:User {id: $idUser})
    RETURN s
  `;

  const result = await db(query, { idStory: params.idStory, idUser: user.id });

  return result.records[0].get("s").properties;
};

export default function EditStory() {
  const story = useLoaderData<Story>();
  console.log(story);
  return "Edit story";
}
