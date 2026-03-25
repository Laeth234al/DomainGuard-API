import Trie from "../ds/trie";
import Spam from "../modules/spam/spam.model";
import TLD from "../modules/tld/tld.model";
import { reverseDomain } from "../utils/domain.normalizer";

type SpamData = {
  trie: Trie;
  blacklist: Set<string>;
  suspiciousTLD: Set<string>;
};

export default async function loadSpamData(): Promise<SpamData> {
  //
  const trie = new Trie();
  //
  const blacklist = new Set<string>();
  //
  const suspiciousTLD = new Set<string>();
  //
  const domains = await Spam.find().select("normalized");
  //
  for (const d of domains) {
    //
    const domain = d.normalized;
    //
    blacklist.add(domain);
    //
    trie.insert(reverseDomain(domain));
  }
  //
  const tlds = await TLD.find().select("tld");
  //
  for (const t of tlds) {
    suspiciousTLD.add(t.tld);
  }
  //
  return {
    trie,
    blacklist,
    suspiciousTLD,
  };
}
