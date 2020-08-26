/**
 * Print the header pairs for debugging purposes
 * @param name - which response object are we logging?
 * @param headers - the headers object of the response
 */
export function logHeaders(name: string, headers: Headers) {
  let pairs = Object.fromEntries(headers.entries());
  console.log(`[DEBUG] ${name}.headers:`);
  console.table(pairs);
}
