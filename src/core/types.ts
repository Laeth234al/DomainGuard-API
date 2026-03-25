export interface DetectionResult {
  isSpam: boolean;
  reasons: string[];
  domain: string;
}

export enum SpamReason {
  BLACKLIST = "BLACKLIST",
  SUSPICIOUS_TLD = "SUSPICIOUS_TLD",
  EXACT = "EXACT_MATCH",
}
