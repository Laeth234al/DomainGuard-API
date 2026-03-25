export function normalizeDomain(domain: string): string {
  return domain
    .toLowerCase()
    .trim()
    .replace(/\.$/, "")
    .replace(/^www\./, "");
}

export function reverseDomain(domain: string): string {
  //
  return normalizeDomain(domain).split(".").reverse().join(".");
}

export function getRootDomain(domain: string): string {
  //
  const parts = domain.split(".");
  //
  if (parts.length < 2) {
    return domain;
  }
  //
  return parts.slice(-2).join(".");
}

export function getTLD(domain: string): string {
  //
  const parts = domain.toLowerCase().split(".");
  //
  return parts[parts.length - 1];
}

export function normalizeTLD(tld: string) {
  //
  return tld.toLowerCase().replace(".", "").trim();
}
