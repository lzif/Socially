import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import styles from "~/tailwind.css";
import useMobileConsole from "~/utils/mobileConsole";
import {
  ThemeBody,
  ThemeHead,
  ThemeProvider,
  useTheme,
} from "~/utils/theme-provider";
import { getThemeSession } from "~/utils/theme.server";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: styles },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const themeSession = await getThemeSession(request);

  return json({
    theme: themeSession.getTheme(),
  });
};

export function Document({
  children,
  title,
}: PropsWithChildren<{ title?: string }>) {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  useEffect(() => {
    useMobileConsole();
  }, []);
  return (
    <html lang="en" className={theme !== "dark" ? "light" : "dark"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <Meta />
        <Links />
        <ThemeHead ssrTheme={Boolean(data.theme)} />
      </head>
      <body className="bg-surface-50 dark:bg-surface-950 text-surface-950 dark:text-surface-50 overflow-auto">
        {process.env.NODE_ENV === "development" && (
          <div className="fixed top-0 right-0 bg-primary-500 p-2 rounded text-pink-200">
            <Link to="/">Home</Link>
            <Link to="/test">Testing</Link>
          </div>
        )}
          {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <ThemeBody ssrTheme={Boolean(data.theme)} />
        <div id="script"></div>
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <Document>
        <Outlet />
      </Document>
    </ThemeProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
        <Document title={`${error.status} ${error.statusText}`}>
          <div className="flex min-h-screen w-screen items-center justify-center">
            <div className="bg-surface-variant rounded-lg bg-opacity-20 p-3">
              <h1 className="text-error mb-5 text-center text-4xl font-bold">
                {error.status} {error.statusText}
              </h1>
              <Link to="/" className="text-primary font-bold">
                Go Home
              </Link>
            </div>
          </div>
        </Document>
    );
  }

  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return (
      <Document title="Uh-oh!">
        <div className="overflow-scroll">
          <h1>App Error</h1>
          <pre>{errorMessage}</pre>
        </div>
      </Document>
  );
}
