import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import jwt from "@tsndr/cloudflare-worker-jwt";

export const loader: LoaderFunction = async (params) => {
  const url = new URL(params.request.url);
  const signature = url.searchParams.get("crystallizeSignature");

  if (!signature) {
    return json({
      message: "Missing `crystallizeSignature` in URL search params",
    });
  }

  let jwtSecret: string | null =
    (params.context?.CRYSTALLIZE_JWT_SECRET as string) || null;

  /**
   * For DEMO purposes, pull secret from a search param. This
   * should NEVER be done in a production-like app
   */
  if (!jwtSecret) {
    jwtSecret = url.searchParams.get("secret");
  }

  if (!jwtSecret) {
    return json({
      jwtSecret,
      message:
        "No JWT secret provided. You can pass it as a query param for this debug app: ?secret=...",
    });
  }

  const jwtVerified = await jwt.verify(signature, jwtSecret);
  const jwtDecoded = await jwt.decode(signature);

  return json({ jwtVerified, jwtSecret, jwt: jwtDecoded });
};

export default function Index() {
  const data = useLoaderData();

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.4",
        padding: 20,
      }}
    >
      <h1>Crystallize Debug App</h1>

      <h2>
        {data.jwtVerified
          ? "Hooray! I trust that Crystallize has initiated the request to open me. ⭐️"
          : "Hm. I do not trust you. Suspecting ill intent. 🏴‍☠️"}
      </h2>

      <h3 style={{ fontSize: "1rem" }}>Context</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
