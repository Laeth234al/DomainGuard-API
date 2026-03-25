import { normalizeTLD, getTLD } from "../../utils/domain.normalizer";
import { getDetector } from "../../core/detector.instance";
import TLD from "./tld.model";
import { logger } from "../../lib/winston";

export default class TLDService {
  async add(tld: string, userId: string) {
    //
    const normalized = normalizeTLD(tld);
    //
    const exists = await TLD.findOne({ tld: normalized });
    //
    if (exists) {
      //
      throw new Error("TLD already exists");
    }
    //
    const newTLD = await TLD.create({
      tld: normalized,
      source: userId,
    });
    //
    getDetector().insertTLD(tld);
    //
    logger.info("Spam TLD added", { tld: normalized, addedBy: userId });
    //
    return newTLD;
  }

  async delete(id: string) {
    //
    const tld = await TLD.findById(id);
    //
    if (!tld) {
      //
      throw new Error("TLD not found");
    }
    //
    await TLD.findByIdAndDelete(id);
    //
    if (tld?.tld) {
      //
      getDetector().removeTLD(tld.tld);
    }
    //
    logger.info("TLD removed", { tld: tld.tld });
    //
    return true;
  }

  async check(domain: string) {
    //
    const tld = getTLD(domain);
    //
    const details = getDetector().isSpam(tld);
    //
    if (details.isSpam) {
      logger.warn("Spam TLD detected", {
        tld: details.domain,
        reasons: details.reasons,
      });
    }
    //
    return {
      tld,
      details,
    };
  }
}
