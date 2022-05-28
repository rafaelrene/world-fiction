import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import type { Story } from "~/types";

import { Form, Link, useLoaderData } from "@remix-run/react";
import classNames from "classnames";

import { db } from "~/services/db.server";
import { requireUser } from "~/helpers/authRoute.server";
import {
  deleteStory,
  editStory,
  setStoryIsPublished,
} from "~/handlers/story.server";

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

export const action: ActionFunction = async ({ request }) => {
  if (request.method === "DELETE") {
    return deleteStory(request);
  }

  if (request.method === "POST") {
    return editStory(request);
  }

  if (request.method === "PATCH") {
    return setStoryIsPublished(request);
  }

  throw new Error("Method was invalid!");
};

export default function EditStory() {
  const story = useLoaderData<Story>();

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-center gap-2">
        <Form method="patch">
          <input
            className="hidden"
            type="checkbox"
            name="isPublished"
            checked={story.isPublished === false}
          />
          <button
            type="submit"
            name="_publish"
            value={story.id}
            className={classNames("rounded p-2 w-fit block", {
              "bg-rose-600": story.isPublished === true,
              "bg-green-600": story.isPublished === false,
            })}
          >
            {story.isPublished === true ? "Unpublish" : "Publish"}
          </button>
        </Form>
        <Link to="chapters" className="rounded p-2 block bg-neutral-600">
          Chapters
        </Link>
        <Form method="delete">
          <button
            type="submit"
            name="_delete"
            value={story.id}
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
        <input type="hidden" name="id" value={story.id} />
        <input
          required
          minLength={3}
          className="container"
          type="text"
          name="title"
          placeholder="Title"
          defaultValue={story.title}
        />
        <textarea
          required
          className="container"
          name="description"
          placeholder="Description"
          defaultValue={story.description}
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
