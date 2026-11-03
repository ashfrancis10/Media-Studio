/** Public sign-in name. The password lives only in the server seed. */
export const OWNER_LOGIN = "sammi.jane.pain";

/** Internal mailbox Better Auth requires. Never shown on the form. */
export const OWNER_EMAIL = "sammi.jane.pain@media.studio";

export function emailForSignIn(raw: string): string {
  const value = raw.trim();
  if (value.toLowerCase() === OWNER_LOGIN) return OWNER_EMAIL;
  return value;
}
