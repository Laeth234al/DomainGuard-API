class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

export default class Trie {
  private root: TrieNode;
  constructor() {
    this.root = new TrieNode();
  }
  insert(word: string): void {
    let node = this.root;
    for (const c of word) {
      if (!node.children.has(c)) {
        node.children.set(c, new TrieNode());
      }
      node = node.children.get(c)!;
    }
    node.isEndOfWord = true;
  }

  search(word: string): boolean {
    let node = this.root;
    for (const c of word) {
      if (!node.children.has(c)) {
        return false;
      }
      node = node.children.get(c)!;
      // logger.info({ char: c, isEnd: node.isEndOfWord });
    }
    return node.isEndOfWord;
  }

  remove(word: string): boolean {
    let node = this.root;
    for (const c of word) {
      if (!node.children.has(c)) {
        return false; // not-found
      }
      node = node.children.get(c)!;
    }
    //
    if (node.isEndOfWord) {
      //
      node.isEndOfWord = false;
      //
      return true; // found
    }
    //
    return false;
  }
}
