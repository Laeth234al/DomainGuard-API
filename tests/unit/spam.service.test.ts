import SpamService from "../../src/modules/spam/spam.service";
import Spam from "../../src/modules/spam/spam.model";
import { normalizeDomain } from "../../src/utils/domain.normalizer";
import { getDetector } from "../../src/core/detector.instance";
import { SpamReason } from "../../src/core/types";

jest.mock("../../src/modules/spam/spam.model");

jest.mock("../../src/utils/domain.normalizer");

jest.mock("../../src/core/detector.instance");

describe("Spam Service:", () => {
  //
  let service: any;
  //
  let detectorMock: any;
  //
  beforeEach(() => {
    //
    service = new SpamService();
    //
    detectorMock = {
      isSpam: jest.fn(),
      insertDomain: jest.fn(),
      removeDomain: jest.fn(),
    };
    //
    (getDetector as jest.Mock).mockReturnValue(detectorMock);
  });
  //
  afterEach(() => {
    jest.clearAllMocks();
  });
  //
  describe("add", () => {
    it("should add domain", async () => {
      //
      (normalizeDomain as jest.Mock).mockReturnValue("test.com");
      //
      (Spam.findOne as jest.Mock).mockResolvedValue(null);
      //
      (Spam.create as jest.Mock).mockResolvedValue({
        domain: "test.com",
        normalized: "test.com",
        source: "user1",
      });
      //
      const result = await service.add("test.com", "user1");
      //
      expect(result.domain).toBe("test.com");
      //
      expect(detectorMock.insertDomain).toHaveBeenCalledWith("test.com");
      //
      expect(detectorMock.insertDomain).toHaveBeenCalledTimes(1);
    });

    it("should throw if exists", async () => {
      //
      (normalizeDomain as jest.Mock).mockReturnValue("test.com");
      //
      (Spam.findOne as jest.Mock).mockResolvedValue({});
      //
      await expect(service.add("test.com", "user1")).rejects.toThrow(
        "Domain already exists"
      );
      //
      expect(detectorMock.insertDomain).not.toHaveBeenCalledWith("test.com");
    });
  });

  describe("delete", () => {
    it("should delete domain", async () => {
      //
      (Spam.findById as jest.Mock).mockResolvedValue({
        _id: "1",
        domain: "test.com",
        normalized: "test.com",
      });
      //
      (Spam.findByIdAndDelete as jest.Mock).mockResolvedValue({});
      //
      const result = await service.delete("1");
      //
      expect(result).toBe(true);
      //
      expect(detectorMock.removeDomain).toHaveBeenCalledWith("test.com");
      //
      expect(detectorMock.removeDomain).toHaveBeenCalledTimes(1);
    });

    it("should throw if not found", async () => {
      //
      (Spam.findById as jest.Mock).mockResolvedValue(null);
      //
      await expect(service.delete("1")).rejects.toThrow("Domain not found");
      //
      expect(detectorMock.removeDomain).not.toHaveBeenCalledWith("test.com");
    });
  });

  describe("check", () => {
    //
    afterEach(() => {
      jest.clearAllMocks();
    });
    //
    it("should detect spam", async () => {
      //
      (normalizeDomain as jest.Mock).mockReturnValue("spam.com");
      //
      detectorMock.isSpam.mockReturnValue({
        isSpam: true,
        domain: "spam.com",
        reasons: [SpamReason.EXACT, SpamReason.BLACKLIST],
      });
      //
      const result = await service.check("spam.com");
      //
      expect(result.details.isSpam).toBe(true);
      //
      expect(detectorMock.isSpam).toHaveBeenCalledTimes(1);
      //
      expect(detectorMock.isSpam).toHaveBeenCalledWith("spam.com");
    });

    it("should return not spam", async () => {
      //
      (normalizeDomain as jest.Mock).mockReturnValue("ok.com");
      //
      detectorMock.isSpam.mockReturnValue({
        isSpam: false,
        domain: "ok.com",
        reasons: [],
      });
      //
      const result = await service.check("ok.com");
      //
      expect(result.details.isSpam).toBe(false);
      //
      expect(detectorMock.isSpam).toHaveBeenCalledTimes(1);
      //
      expect(detectorMock.isSpam).toHaveBeenCalledWith("ok.com");
    });
  });
});
