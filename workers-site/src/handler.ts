import { getAssetFromKV, Options } from "@cloudflare/kv-asset-handler";
import { logHeaders } from "./utils";

/**
 * The business!
 * @param event - the FetchEvent
 * @param DEBUG - disable asset fetch caching, control error responses, and enables some verbose logging
 */
export async function handleEvent(event: FetchEvent, DEBUG: boolean = false) {
  const url = new URL(event.request.url);
  if (DEBUG) {
    console.log(`[HANDLE EVENT] -> url = ${JSON.stringify(url)}`);
  }
  let options: Partial<Options> = {};

  /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function `mapRequestToAsset`
   */
  // options.mapRequestToAsset = handlePrefix(/^\/docs/)

  try {
    if (DEBUG) {
      options.cacheControl = { bypassCache: true };
    }
    const page = await getAssetFromKV(event, options);
    if (DEBUG) {
      logHeaders("page", page.headers);
    }

    const response = new Response(page.body, page);
    response.headers.set("x-xss-protection", "1; mode=block");
    response.headers.set("x-content-type-options", "nosniff");
    response.headers.set("x-frame-options", "DENY");
    response.headers.set(
      "content-security-policy",
      "default-src 'self'; frame-src 'none'; object-src 'none'; script-src 'none'; base-uri 'none'"
    );
    response.headers.set(
      "referrer-policy",
      "no-referrer, strict-origin-when-cross-origin"
    );
    // response.headers.set('feature-policy', 'none');
    // response.headers.set(
    //   'feature-policy',
    //   "accelerometer 'none'; ambient-light-sensor 'none'; autoplay 'none'; battery 'none'; camera 'none'; display-capture 'none'; document-domain 'none'; encrypted-media 'none'; fullscreen 'none'; geolocation 'none'; gyroscope 'none'; legacy-image-formats 'none'; magnetometer 'none'; microphone 'none'; midi 'none'; oversized-images 'none'; payment 'none'; picture-in-picture 'none'; publickey-credentials 'none'; sync-xhr 'none'; unoptimized-images 'none'; unsized-media 'none'; usb 'none'; vibrate 'none'; vr 'none'; wake-lock 'none'; xr-spatial-tracking 'none';"
    // );
    // Chrome 84 compatible set:
    response.headers.set(
      "feature-policy",
      "accelerometer 'none'; autoplay 'none'; camera 'none'; document-domain 'none'; encrypted-media 'none'; fullscreen 'none'; geolocation 'none'; gyroscope 'none'; magnetometer 'none'; microphone 'none'; midi 'none'; payment 'none'; picture-in-picture 'none'; sync-xhr 'none'; usb 'none'; xr-spatial-tracking 'none';"
    );
    response.headers.set("x-server", "unicorn");
    response.headers.set(
      "cache-control",
      "public, max-age=86400, s-maxage=14400, max-stale=3600, stale-while-revalidate=3600, stale-if-error=3600"
    );
    if (DEBUG) {
      logHeaders("response", response.headers);
    }
    // https://developers.cloudflare.com/workers/learning/using-streams
    let { readable, writable } = new TransformStream();
    // @ts-ignore: strictNullChecks
    response.body.pipeTo(writable);
    return new Response(readable, response);
  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: (req) =>
            new Request(`${new URL(req.url).origin}/404.html`, req),
        });

        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 404,
        });
      } catch (e) {}
    }
    return new Response(e.message || e.toString(), { status: 500 });
  }
}

// /**
//  * Here's one example of how to modify a request to
//  * remove a specific prefix, in this case `/docs` from
//  * the url. This can be useful if you are deploying to a
//  * route on a zone, or if you only want your static content
//  * to exist at a specific path.
//  */
// function handlePrefix(prefix) {
//   return request => {
//     // compute the default (e.g. / -> index.html)
//     let defaultAssetKey = mapRequestToAsset(request)
//     let url = new URL(defaultAssetKey.url)
//
//     // strip the prefix from the path for lookup
//     url.pathname = url.pathname.replace(prefix, '/')
//
//     // inherit all other props from the default request
//     return new Request(url.toString(), defaultAssetKey)
//   }
// }
