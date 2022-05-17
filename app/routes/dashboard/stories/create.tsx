import type { ActionFunction, MetaFunction } from "@remix-run/node";
import type { Story } from "~/types";

import { redirect } from "@remix-run/node";

import { Form } from "@remix-run/react";
import { v4 } from "uuid";
import { DateTime } from "luxon";

import { requireUser } from "~/helpers/authRoute";
import { db } from "~/services/db.server";

export const meta: MetaFunction = () => ({
  title: "Crete Story [World Fiction]",
});

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData) as Pick<
    Story,
    "title" | "description"
  >;

  if (formValues.title === undefined) {
    throw new Error("Story title is required");
  }

  if (formValues.description === undefined) {
    throw new Error("Story description is required");
  }

  const story: Story = {
    id: v4(),
    title: formValues.title,
    description: formValues.description,
    published: false,
    createdAt: DateTime.utc().toISO(),
    updatedAt: DateTime.utc().toISO(),
    cover: null,
  };

  const query = `
    MATCH (u:User {id: $idUser})
    CREATE (s:Story $story)-[:CREATED_BY]->(u)
    RETURN s
  `;

  await db(query, { story, idUser: user.id });

  return redirect(`/dashboard/stories/edit/${story.id}`);
};

export default function CreateStory() {
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
      <button
        className="container rounded p-2 bg-rose-600 text-slate-50"
        type="submit"
      >
        Create
      </button>
    </Form>
  );
}
