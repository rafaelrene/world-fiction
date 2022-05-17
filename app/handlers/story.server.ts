import type { Story } from "~/types";

import { redirect } from "@remix-run/node";
import { DateTime } from "luxon";

import { db } from "~/services/db.server";

export const deleteStory = async (request: Request) => {
	const formData = await request.formData();
	const idStoryToDelete = formData.get("_delete");

	if (idStoryToDelete === null) {
		throw new Error("idStory must be provided!");
	}

	const query = `
    MATCH (s:Story {id: $idStory})
    DETACH DELETE s
  `;

	await db(query, { idStory: idStoryToDelete });

	return redirect("/dashboard/stories");
};

export const editStory = async (request: Request) => {
	const formData = await request.formData();
	const formValues = Object.fromEntries(formData) as Pick<
		Story,
		"id" | "title" | "description"
	>;

	const story: Pick<Story, "id" | "title" | "description" | "updatedAt"> = {
		id: formValues.id,
		title: formValues.title,
		description: formValues.description,
		updatedAt: DateTime.utc().toISO(),
	};

	const query = `
		MATCH(s:Story {id: $story.id})
		SET s += $story
		RETURN s
	`;

	const result = await db(query, { story });

	return result.records[0].get("s").properties;
};

export const setStoryIsPublished = async (request: Request) => {
	const formData = await request.formData();
	const formValues = Object.fromEntries(formData);

	const story = {
		id: formValues._publish,
		isPublished: formValues.isPublished === "on",
	};

	const query = `
		MATCH(s:Story {id: $story.id})
		SET s += $story
		RETURN s
	`;

	const result = await db(query, { story });

	return result.records[0].get("s").properties;
};
