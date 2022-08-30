import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import jwt from "@tsndr/cloudflare-worker-jwt";

export const loader: LoaderFunction = async (params) => {
  const url = new URL(params.request.url);
  const signature = url.searchParams.get("crystallizeSignature");

  let valid = false;
  if (!signature) {
    return json({ valid });
  }

  const jwtDecoded = await jwt.decode(signature);

  // Get the tenant in the context
  // const { tenant } = decoded.payload;
  // if (!tenant) {
  //   return json({ valid });
  // }

  // Validate by pulling the tenant secret

  return json({ valid, jwt: jwtDecoded });
};

export default function Index() {
  const data = useLoaderData();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Crystallize Debug App</h1>

      <h2>Crystallize signature</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
