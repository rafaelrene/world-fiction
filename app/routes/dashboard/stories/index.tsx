import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { Story } from "~/types";

import { Link, useLoaderData } from "@remix-run/react";
import classNames from "classnames";

import { requireUser } from "~/helpers/authRoute.server";
import { db } from "~/services/db.server";
import { Img } from "react-image";

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

const mediaStyles = {
  display: "grid",
  gridTemplateRows: "24px 1fr 24px",
  gridTemplateColumns: "64px 1fr",
  gridTemplateAreas: `
    'image title'
    'image description'
    'footer footer'
  `,
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
        {stories.map(({ title, cover, description, isPublished, id }) => (
          <li style={mediaStyles} className="p-2 gap-2" key={id}>
            <div style={{ gridArea: "image" }}>
              <Img src={cover} />
            </div>
            <div
              style={{ gridArea: "title" }}
              className="truncate"
              title={title}
            >
              <Link to={`edit/${id}`} className="hover:text-rose-600">
                {title}
              </Link>
            </div>
            <div style={{ gridArea: "description" }}>{description}</div>
            <div
              style={{ gridArea: "footer" }}
              className={classNames("text-rose-600", {
                "text-green-600": isPublished === true,
              })}
            >
              {isPublished === true ? "Yes" : "No"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
