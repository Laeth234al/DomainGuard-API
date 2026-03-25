import Trie from "../ds/trie";
import loadSpamData from "../init/load.data";
import {
  getTLD,
  normalizeDomain,
  normalizeTLD,
  reverseDomain,
} from "../utils/domain.normalizer";
import { DetectionResult, SpamReason } from "./types";

export class SpamDetector {
  private trie: Trie;
  private blacklist: Set<string>;
  private suspiciousTLD: Set<string>;

  constructor(trie: Trie, blacklist: Set<string>, suspiciousTLD: Set<string>) {
    this.trie = trie;
    this.blacklist = blacklist;
    this.suspiciousTLD = suspiciousTLD;
  }

  static async create() {
    //
    const { trie, blacklist, suspiciousTLD } = await loadSpamData();
    //
    return new SpamDetector(trie, blacklist, suspiciousTLD);
  }

  isSpam(email?: string): DetectionResult {
    //
    if (!email) {
      return {
        isSpam: false,
        reasons: [],
        domain: "",
      };
    }
    //
    const domain = this.extractDomain(email);
    //
    if (!domain) {
      return {
        isSpam: false,
        reasons: [],
        domain: "",
      };
    }
    //
    // if (domain === email) return false;
    //
    const reasons: string[] = [];
    //
    const normalized = normalizeDomain(domain);
    //
    const reversed = reverseDomain(normalized);
    //
    if (this.checkTrie(reversed)) {
      reasons.push(SpamReason.BLACKLIST);
    }
    //
    if (this.checkSuspiciousTLD(normalized)) {
      reasons.push(SpamReason.SUSPICIOUS_TLD);
    }
    //
    if (this.checkBlacklist(normalized)) {
      reasons.push(SpamReason.EXACT);
    }
    //
    return {
      isSpam: reasons.length > 0,
      reasons,
      domain: normalized,
    };
  }

  insertDomain(domain: string) {
    //
    const normalized = normalizeDomain(domain);
    //
    this.blacklist.add(normalized);
    //
    this.trie.insert(reverseDomain(normalized));
  }

  insertEmail(email: string) {
    //
    const domain = this.extractDomain(email);
    //
    return this.insertDomain(domain);
  }

  insertDomains(domains: string[]) {
    domains.forEach((domain) => {
      this.insertDomain(domain);
    });
  }

  insertEmails(emails: string[]) {
    emails.forEach((email) => {
      this.insertEmail(email);
    });
  }

  removeEmail(email: string): boolean {
    //
    const domain = this.extractDomain(email);
    //
    return this.removeDomain(domain);
  }

  removeDomain(domain: string): boolean {
    //
    const normalized = normalizeDomain(domain);
    //
    const reversedDomain = reverseDomain(normalized);
    //
    if (this.trie.remove(reversedDomain)) {
      //
      this.blacklist.delete(normalized);
      //
      return true;
    }
    //
    return false;
  }

  insertTLD(tld: string) {
    //
    this.suspiciousTLD.add(normalizeTLD(tld));
  }

  removeTLD(tld: string) {
    //
    this.suspiciousTLD.delete(normalizeTLD(tld));
  }

  private extractDomain(email?: string): string {
    //
    if (!email || typeof email !== "string") {
      return "";
    }
    //
    if (!email.includes("@")) return email;
    //
    const parts = email.split("@");
    if (parts.length !== 2) return email;
    //
    let domain = parts[1].toLowerCase().trim();
    //
    return domain;
  }

  private checkBlacklist(domain: string): boolean {
    return this.blacklist.has(domain);
  }

  private checkTrie(domain: string): boolean {
    return this.trie.search(domain);
  }

  private checkSuspiciousTLD(domain: string): boolean {
    return this.suspiciousTLD.has(getTLD(domain));
  }
}
