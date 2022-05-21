import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { Chapter } from "~/types";

import { Link, useLoaderData } from "@remix-run/react";

import { requireUser } from "~/helpers/authRoute.server";
import { db } from "~/services/db.server";

export const meta: MetaFunction = () => ({
  title: "My Chapters [World Fiction]",
});

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);

  const query = `
    MATCH (c:Chapter)-[:CREATED_BY]->(:User {id: $idUser})
    RETURN c
  `;

  const result = await db(query, { idUser: user.id });

  return result.records.map((record) => record.get("c").properties);
};

export default function ChaptersIndex() {
  const chapters = useLoaderData<Chapter[]>();

  return (
    <div className="w-full flex flex-col gap-2">
      <section className="flex justify-center">
        <Link to="create" className="rounded bg-rose-600 p-2 w-fit block">
          Create Chapter
        </Link>
      </section>
      <ul className="bg-slate-700 container m-auto rounded p-2">
        {chapters.map((chapter) => (
          <Link to={`edit/${chapter.id}`}>{chapter.title}</Link>
        ))}
      </ul>
    </div>
  );
}
