import type { Chapter } from "~/types";

import { redirect } from "@remix-run/node";
import { DateTime } from "luxon";

import { db } from "~/services/db.server";

export const deleteChapter = async (request: Request) => {
    const formData = await request.formData();
    const idChapterToDelete = formData.get("_delete");

    if (idChapterToDelete === null) {
        throw new Error("idChapter must be provided!");
    }

    const query = `
    MATCH (c:Chapter {id: $idChapter})
    DETACH DELETE c
  `;

    await db(query, { idChapter: idChapterToDelete });

    return redirect("/dashboard/chapters");
};

export const editChapter = async (request: Request) => {
    const formData = await request.formData();
    const formValues = Object.fromEntries(formData) as Omit<
        Chapter,
        "createdAt" | "updatedAt"
    >;

    const chapter: Omit<Chapter, "createdAt"> = {
        id: formValues.id,
        title: formValues.title,
        description: formValues.description,
        content: formValues.content,
        updatedAt: DateTime.utc().toISO(),
    };

    const query = `
        MATCH(c:Chapter {id: $chapter.id})
        SET c += $chapter
        RETURN c
    `;

    const result = await db(query, { chapter });

    return result.records[0].get("c").properties;
};
