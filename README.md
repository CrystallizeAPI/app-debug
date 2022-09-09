# Example of a Crystallize App

This is a basic [Remix](https://remix.run) app, cofigured to run on [Cloudlare Workers](https://workers.cloudflare.com), showcasing how you can debug the JTW token for a Crystallize app.

All apps receive a `crystallizeSignature` JWT in the request query parameters. This app consumes the signature, decodes and verifies it.