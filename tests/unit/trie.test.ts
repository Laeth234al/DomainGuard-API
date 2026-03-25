import Trie from "../../src/ds/trie";

describe("Trie Tree Data Structrue:", () => {
  let trie: Trie;
  //
  beforeEach(() => {
    trie = new Trie();
  });
  //
  test("should return true for inserted node", () => {
    //
    trie.insert("cat");
    //
    expect(trie.search("cat")).toBe(true);
  });
  test("should return false for removed node", () => {
    //
    trie.insert("cap");
    //
    expect(trie.remove("cap")).toBe(true); // means removed
    //
    expect(trie.search("cap")).toBe(false);
  });
  test("should return false for removed node #2", () => {
    //
    trie.insert("cap");
    //
    trie.insert("cat");
    //
    trie.insert("cap");
    //
    expect(trie.remove("cap")).toBe(true); // means removed
    //
    expect(trie.search("cap")).toBe(false);
  });
  test("should return false for removed node #3", () => {
    //
    trie.insert("cap");
    //
    expect(trie.remove("cap")).toBe(true); // means removed
    //
    expect(trie.remove("cap")).toBe(false); // means not-found
    //
    expect(trie.search("cap")).toBe(false);
  });
});
