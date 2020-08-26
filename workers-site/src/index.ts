import CloudflareWorkerGlobalScope from "types-cloudflare-worker";
import { handleEvent } from "./handler";

declare var self: CloudflareWorkerGlobalScope;

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG: boolean = false;

self.addEventListener("fetch", (event) => {
  try {
    event.respondWith(handleEvent(event, DEBUG));
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        })
      );
    }
    event.respondWith(new Response("Internal Error", { status: 500 }));
  }
});
