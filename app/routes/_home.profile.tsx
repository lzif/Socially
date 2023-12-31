import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import UserProfile from "~/components/Profile";
import { authenticator } from "~/services/auth.server";
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  return json(user);
}

export default function User() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <UserProfile
        name={data!.name}
        userName={data!.userName}
        email={data!.email}
        picture={data?.picture}
        bio={data?.bio}
      />
    </>
  );
}
