import type { LinksFunction } from "@remix-run/node";

import tailwindHref from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindHref },
];

export default function Index() {
  return <div>World Fiction</div>;
}
