import TLDService from "../../src/modules/tld/tld.service";
import TLD from "../../src/modules/tld/tld.model";
import { normalizeTLD, getTLD } from "../../src/utils/domain.normalizer";
import { getDetector } from "../../src/core/detector.instance";
import { SpamReason } from "../../src/core/types";

jest.mock("../../src/modules/tld/tld.model");

jest.mock("../../src/utils/domain.normalizer");

jest.mock("../../src/core/detector.instance");

describe("TLD Service:", () => {
  //
  let service: any;
  //
  let detectorMock: any;
  //
  beforeEach(() => {
    //
    service = new TLDService();
    //
    detectorMock = {
      isSpam: jest.fn(),
      insertTLD: jest.fn(),
      removeTLD: jest.fn(),
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
    it("should add tld", async () => {
      //
      (normalizeTLD as jest.Mock).mockReturnValue("xyz");
      //
      (TLD.findOne as jest.Mock).mockResolvedValue(null);
      //
      (TLD.create as jest.Mock).mockResolvedValue({
        tld: "xyz",
        source: "user1",
      });
      //
      const result = await service.add("xyz", "user1");
      //
      expect(result.tld).toBe("xyz");
      //
      expect(detectorMock.insertTLD).toHaveBeenCalledWith("xyz");
      //
      expect(detectorMock.insertTLD).toHaveBeenCalledTimes(1);
    });

    it("should thorw if exists", async () => {
      //
      (normalizeTLD as jest.Mock).mockReturnValue("xyz");
      //
      (TLD.findOne as jest.Mock).mockResolvedValue({});
      //
      await expect(service.add("xyz", "user1")).rejects.toThrow(
        "TLD already exists"
      );
      //
      expect(detectorMock.insertTLD).not.toHaveBeenCalledWith("xyz");
    });
  });

  describe("delete", () => {
    it("should delete tld", async () => {
      //
      (TLD.findById as jest.Mock).mockResolvedValue({
        _id: "1",
        tld: "xyz",
        source: "user1",
      });
      //
      (TLD.findByIdAndDelete as jest.Mock).mockResolvedValue({});
      //
      const result = await service.delete("1");
      //
      expect(result).toBe(true);
      //
      expect(detectorMock.removeTLD).toHaveBeenCalledWith("xyz");
      //
      expect(detectorMock.removeTLD).toHaveBeenCalledTimes(1);
    });

    it("should throw if TLD not found", async () => {
      //
      (TLD.findById as jest.Mock).mockResolvedValue(null);
      //
      await expect(service.delete("1")).rejects.toThrow("TLD not found");
      //
      expect(detectorMock.removeTLD).not.toHaveBeenCalledWith("xyz");
    });
  });

  describe("check", () => {
    //
    afterEach(() => {
      jest.clearAllMocks();
    });
    //
    it("should detect tld", async () => {
      //
      (getTLD as jest.Mock).mockReturnValue("xyz");
      //
      detectorMock.isSpam.mockReturnValue({
        isSpam: true,
        domain: "xyz",
        reasons: [SpamReason.SUSPICIOUS_TLD],
      });
      //
      const result = await service.check("xyz");
      //
      expect(result.details.isSpam).toBe(true);
      //
      expect(detectorMock.isSpam).toHaveBeenCalledWith("xyz");
      //
      expect(detectorMock.isSpam).toHaveBeenCalledTimes(1);
    });

    it("should return not spam", async () => {
      //
      (getTLD as jest.Mock).mockReturnValue("com");
      //
      detectorMock.isSpam.mockReturnValue({
        isSpam: false,
        domain: "com",
        reasons: [],
      });
      //
      const result = await service.check("com");
      //
      expect(result.details.isSpam).toBe(false);
      //
      expect(detectorMock.isSpam).toHaveBeenCalledTimes(1);
      //
      expect(detectorMock.isSpam).toHaveBeenCalledWith("com");
    });
  });
});
