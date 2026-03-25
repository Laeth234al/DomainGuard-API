import { SpamDetector } from "../../src/core/spam.detector";
import { SpamReason } from "../../src/core/types";
import Trie from "../../src/ds/trie";

describe("SpamDetector: ", () => {
  //
  let detector: SpamDetector;
  //
  beforeEach(() => {
    const trie = new Trie();
    const blacklist = new Set<string>();
    const tlds = new Set<string>();
    //
    detector = new SpamDetector(trie, blacklist, tlds);
  });
  //
  test("isSpam: should return not spam for not added domain/email", () => {
    //
    const result = detector.isSpam("laith@gmail.com");
    //
    expect(result.isSpam).toBe(false);
  });
  test("isSpam: should return spam for added domain/email", () => {
    detector.insertDomain("gmail.com.");
    //
    const result = detector.isSpam("laith@gmail.com");
    //
    expect(result.isSpam).toBe(true);
    //
    expect(result.reasons).toContain(SpamReason.EXACT);
    //
    expect(result.reasons).toContain(SpamReason.BLACKLIST);
  });
  test("isSpam: should return not spam for removed domain/email", () => {
    detector.insertDomain("gmail.com");
    //
    detector.removeDomain("gmail.com.");
    //
    const result = detector.isSpam("laith@gmail.com");
    //
    expect(result.isSpam).toBe(false);
  });
  test("isSpam: should return spam for domain/email with 3 reasons", () => {
    //
    detector.insertDomain("gmail.xyz");
    //
    detector.insertTLD(".xyz");
    //
    const result = detector.isSpam("laith@gmail.xyz");
    //
    expect(result.isSpam).toBe(true);
    //
    expect(result.reasons).toContain(SpamReason.EXACT);
    //
    expect(result.reasons).toContain(SpamReason.BLACKLIST);
    //
    expect(result.reasons).toContain(SpamReason.SUSPICIOUS_TLD);
  });
  test("isSpam: should return spam for tld with 1 reasons", () => {
    //
    detector.insertDomain("gmail.xyz");
    //
    detector.insertTLD(".xyz");
    //
    const result = detector.isSpam(".xyz");
    //
    expect(result.isSpam).toBe(true);
    //
    expect(result.reasons).toContain(SpamReason.SUSPICIOUS_TLD);
  });
  test("isSpam: #1 should return not spam for tld", () => {
    //
    detector.insertTLD(".xyz");
    //
    detector.removeTLD("xyz");
    //
    const result = detector.isSpam(".xyz");
    //
    expect(result.isSpam).toBe(false);
  });
  test("isSpam: #2 should return not spam for tld", () => {
    //
    detector.insertTLD("xyz");
    //
    detector.removeTLD(".xyz");
    //
    const result = detector.isSpam(".xyz");
    //
    expect(result.isSpam).toBe(false);
  });
  test("isSpam: #3 should return not spam for tld", () => {
    //
    detector.insertTLD("xyz");
    //
    detector.removeTLD(".xyz");
    //
    const result = detector.isSpam("xyz");
    //
    expect(result.isSpam).toBe(false);
  });
  test("isSpam: #4 should return not spam for tld", () => {
    //
    detector.insertTLD(".xyz");
    //
    detector.removeTLD("xyz");
    //
    const result = detector.isSpam("xyz");
    //
    expect(result.isSpam).toBe(false);
  });
  test("insertEmails: should insert multiple emails", () => {
    //
    detector.insertEmails(["a@spam.com", "b@evil.com"]);
    //
    expect(detector.isSpam("test@SPAM.COM ").isSpam).toBe(true);
    expect(detector.isSpam("test@EviL.COM.").isSpam).toBe(true);
  });
  test("insertDomains: should insert multiple domains", () => {
    //
    detector.insertEmails(["spam.com", "evil.com"]);
    //
    expect(detector.isSpam("SPAM.COM ").isSpam).toBe(true);
    expect(detector.isSpam("EviL.COM.").isSpam).toBe(true);
  });
  test("should normalize domain", () => {
    //
    const result = detector.isSpam("test@SPAM.COM.");
    //
    expect(result.domain).toBe("spam.com");
  });
});
