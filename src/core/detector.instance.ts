import { logger } from "../lib/winston";
import { SpamDetector } from "./spam.detector";

let detector: SpamDetector;

export async function initDetector() {
  //
  detector = await SpamDetector.create();
  //
  logger.info("Spam detector ready");
}

export function getDetector() {
  //
  if (!detector) {
    //
    throw new Error("Detector not initialized");
  }
  //
  return detector;
}

export function setDetector(mock: SpamDetector) {
  //
  detector = mock;
}
