import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { Story } from "~/types";

import { Link, useLoaderData } from "@remix-run/react";
import classNames from "classnames";

import { requireUser } from "~/helpers/authRoute";
import { db } from "~/services/db.server";

export const meta: MetaFunction = () => ({
  title: "My Stories [World Fiction]",
});

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);

  const query = `
    MATCH (s:Story)-[:CREATED_BY]->(:User {id: $idUser})
    RETURN s
  `;

  const result = await db(query, { idUser: user.id });

  return result.records.map((record) => record.get("s").properties);
};

export default function StoriesIndex() {
  const stories = useLoaderData<Story[]>();

  return (
    <div className="w-full flex flex-col gap-2 text-slate-50">
      <section className="flex justify-center">
        <Link to="create" className="rounded bg-rose-600 p-2 w-fit block">
          Create Story
        </Link>
      </section>
      <ul className="bg-slate-700 container m-auto rounded p-2">
        <li className="flex justify-around gap-2 font-bold">
          <div className="basis-2/12">Title</div>
          <div className="basis-9/12">Description</div>
          <div className="basis-1/12 text-right">Is Published?</div>
        </li>
        {stories.map(({ title, description, published, id }) => (
          <li className="flex justify-around gap-2" key={id}>
            <div className="basis-2/12 truncate" title={title}>
              <Link to={`edit/${id}`} className="hover:text-rose-600">
                {title}
              </Link>
            </div>
            <div className="basis-9/12">{description}</div>
            <div
              className={classNames("basis-1/12 text-rose-600 text-right", {
                "text-green-600": published === true,
              })}
            >
              {published === true ? "Yes" : "No"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
