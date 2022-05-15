import type { MetaFunction } from "@remix-run/node";

import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => ({
  title: "My Stories [World Fiction]",
});

export default function StoriesIndex() {
  return (
    <Link to="create" className="rounded bg-rose-600 text-slate-50 p-2">
      Create Story
    </Link>
  );
}
