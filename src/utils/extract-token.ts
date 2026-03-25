export function extractToken(authHeader?: string): string | null {
  //
  if (!authHeader) {
    return null;
  }
  //
  if (!authHeader.startsWith("Bearer")) {
    return null;
  }
  //
  return authHeader.split(" ")[1];
}
