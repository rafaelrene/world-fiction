import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import type { Chapter } from "~/types";

import { Form, useLoaderData } from "@remix-run/react";

import { db } from "~/services/db.server";
import { requireUser } from "~/helpers/authRoute.server";
import { deleteChapter, editChapter } from "~/handlers/chapter.server";

export const meta: MetaFunction = ({ data }) => ({
  title: `${data.title} - Edit [World Fiction]`,
});

export const loader: LoaderFunction = async ({ request, params }) => {
  if (params.idChapter === undefined) {
    throw new Error("idChapter must be provided!");
  }

  const user = await requireUser(request);

  const query = `
    MATCH (c:Chapter {id: $idChapter})-[:CREATED_BY]->(:User {id: $idUser})
    RETURN c
  `;

  const result = await db(query, {
    idChapter: params.idChapter,
    idUser: user.id,
  });

  return result.records[0].get("c").properties;
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method === "DELETE") {
    return deleteChapter(request);
  }

  if (request.method === "POST") {
    return editChapter(request);
  }

  throw new Error("Method was invalid!");
};

export default function EditStory() {
  const chapter = useLoaderData<Chapter>();

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-center gap-2">
        <Form method="delete">
          <button
            type="submit"
            name="_delete"
            value={chapter.id}
            className="rounded bg-rose-600 p-2 w-fit block"
          >
            Delete
          </button>
        </Form>
      </div>
      <Form
        method="post"
        className="flex flex-col gap-2 m-auto items-center container text-slate-900"
      >
        <input type="hidden" name="id" value={chapter.id} />
        <input
          required
          minLength={3}
          className="container"
          type="text"
          name="title"
          placeholder="Title"
          defaultValue={chapter.title}
        />
        <textarea
          required
          className="container"
          name="description"
          placeholder="Description"
          defaultValue={chapter.description}
        />
        <textarea
          required
          className="container"
          name="content"
          placeholder="Description"
          defaultValue={chapter.content}
        />
        <button
          className="container rounded p-2 bg-rose-600 text-slate-50"
          type="submit"
        >
          Edit
        </button>
      </Form>
    </div>
  );
}
