import type { ActionFunction, MetaFunction } from "@remix-run/node";
import type { Chapter } from "~/types";

import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { v4 } from "uuid";
import { DateTime } from "luxon";

import { requireUser } from "~/helpers/authRoute.server";
import { db } from "~/services/db.server";

export const meta: MetaFunction = () => ({
  title: "Create Chapter [World Fiction]",
});

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    throw new Error("Wrong method!");
  }

  const user = await requireUser(request);
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData) as Omit<
    Chapter,
    "id" | "createdAt" | "updatedAt"
  >;

  if (formValues.title === undefined) {
    throw new Error("Chapter title is required");
  }

  if (formValues.content === undefined) {
    throw new Error("Chapter content is required");
  }

  if (formValues.description === undefined) {
    throw new Error("Chapter description is required");
  }

  const chapter: Chapter = {
    id: v4(),
    title: formValues.title,
    description: formValues.description,
    content: formValues.content,
    createdAt: DateTime.utc().toISO(),
    updatedAt: DateTime.utc().toISO(),
  };

  const query = `
    MATCH (u:User {id: $idUser})
    CREATE (c:Chapter $chapter)-[:CREATED_BY]->(u)
    RETURN c
  `;

  await db(query, { chapter, idUser: user.id });

  return redirect(`/dashboard/chapters/edit/${chapter.id}`);
};

export default function CreateChapter() {
  return (
    <Form
      method="post"
      className="flex flex-col gap-2 items-center container text-slate-900"
    >
      <input
        required
        minLength={3}
        className="container"
        type="text"
        name="title"
        placeholder="Title"
      />
      <textarea
        required
        className="container"
        name="description"
        placeholder="Description"
      />
      <textarea
        required
        className="container"
        name="content"
        placeholder="Chapter content"
      />
      <button
        className="container rounded p-2 bg-rose-600 text-slate-50"
        type="submit"
      >
        Create
      </button>
    </Form>
  );
}
