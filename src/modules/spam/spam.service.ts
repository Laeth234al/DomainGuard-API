import { normalizeDomain } from "../../utils/domain.normalizer";
import { getDetector } from "../../core/detector.instance";
import Spam from "./spam.model";
import { logger } from "../../lib/winston";

export default class SpamService {
  async add(domain: string, userId: string) {
    //
    const normalized = normalizeDomain(domain);
    //
    const exists = await Spam.findOne({ domain });
    //
    if (exists) {
      //
      throw new Error("Domain already exists");
    }
    //
    const spam = await Spam.create({
      domain,
      normalized,
      source: userId,
    });
    //
    getDetector().insertDomain(normalized);
    //
    logger.info("Spam Domain added", { domain: normalized, addedBy: userId });
    //
    return spam;
  }

  async delete(id: string) {
    const spam = await Spam.findById(id);
    //
    if (!spam) {
      //
      throw new Error("Domain not found");
    }
    //
    await Spam.findByIdAndDelete(id);
    //
    getDetector().removeDomain(spam.normalized);
    //
    logger.info("Spam Domain removed", { domain: spam.normalized });
    //
    return true;
  }

  async check(domain: string) {
    //
    const normalized = normalizeDomain(domain);
    //
    const details = getDetector().isSpam(normalized);
    //
    if (details.isSpam) {
      logger.warn("Spam detected", {
        domain: details.domain,
        reasons: details.reasons,
      });
    }
    //
    return {
      domain,
      details,
    };
  }
}
