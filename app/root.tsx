import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { LinksFunction } from "@remix-run/node";
import styles from "#app/styles/app.css?url";
import { Icon } from "./components/ui/icon";
import { sleep } from "./utils/misc";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const clientLoader = async () => {
  await sleep(3000);
  return null;
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex h-full min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Icon className="animate-spin" name="loader-circle" size="giant" />
    </div>
  );
}
