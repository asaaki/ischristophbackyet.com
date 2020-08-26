export function logHeaders(name: string, headers: Headers) {
  let pairs = Object.fromEntries(headers.entries());
  console.log(`[DEBUG] ${name}.headers:`);
  console.table(pairs);
}
