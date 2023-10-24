import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLocation, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import NavBar from "~/components/navbar";

export let loader = async ({ request }: LoaderFunctionArgs) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return json(user!.picture);
};

export default function HomeLayout() {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();
  let avatar: string | undefined;
  if (data !== null) {
    avatar = data;
  }
  return (
    <>
      <Outlet />
      <NavBar location={location.pathname} avatar={avatar} />
    </>
  );
}