import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { Chapter } from "~/types";

import { Form, useLoaderData } from "@remix-run/react";
import { useForm } from "react-hook-form";

import { requireUser } from "~/helpers/authRoute.server";
import { db } from "~/services/db.server";

type FormInput = {
  [key: string]: number;
};

export const meta: MetaFunction = () => ({
  title: "Story chapters [World Fiction]",
});

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);

  const query = `
    MATCH (c:Chapter)-[:CREATED_BY]->(:User {id: $idUser})
    RETURN c
  `;

  const result = await db(query, { idUser: user.id, idStory: params.idStory });

  return result.records.map((record) => record.get("c").properties);
};

export default function StoriesIndex() {
  const chapters = useLoaderData<Chapter[]>();
  const { register, getValues } = useForm<FormInput>();

  return (
    <Form method="post" className="w-full flex flex-col gap-2">
      <ul className="bg-slate-700 container m-auto rounded p-2">
        {chapters.map((chapter) => (
          <li className="flex gap-2 items-center" key={chapter.id}>
            <div className="grow">{chapter.title}</div>
            <input
              className="basis-12 text-slate-700"
              type="number"
              min="1"
              {...register(chapter.id, { min: 1, valueAsNumber: true })}
            />
          </li>
        ))}
      </ul>

      <button
        className="container rounded p-2 m-auto bg-rose-600 text-slate-50"
        type="submit"
      >
        Submit
      </button>
    </Form>
  );
}
