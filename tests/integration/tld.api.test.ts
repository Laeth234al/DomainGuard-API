import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import TLD from "../../src/modules/tld/tld.model";
import Trie from "../../src/ds/trie";
import { setDetector } from "../../src/core/detector.instance";
import { SpamDetector } from "../../src/core/spam.detector";
import { generateTestToken } from "../utils/test.token";

describe("TLD Api", () => {
  //
  let adminToken: string;
  let userToken: string;
  //
  beforeEach(() => {
    //
    adminToken = generateTestToken("admin");
    //
    userToken = generateTestToken("user");
    //
    setDetector(
      new SpamDetector(new Trie(), new Set<string>(), new Set<string>())
    );
  });
  //
  describe("add", () => {
    it("should add TLD by admin", async () => {
      //
      const res = await request(app)
        .post("/api/tld/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          tld: "xyz",
        });
      //
      expect(res.status).toBe(201);
      //
      expect(res.body.tld).toBe("xyz");
    });

    it("should not enter invalid data #1", async () => {
      //
      const res = await request(app)
        .post("/api/tld/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          tld: "",
        });
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
      //
      expect(res.body.errors.tld).toBeDefined();
    });
    it("should not enter invalid data #2", async () => {
      //
      const res = await request(app)
        .post("/api/tld/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          tld: true,
        });
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
      //
      expect(res.body.errors.tld).toBeDefined();
    });
    it("should not enter invalid data #3", async () => {
      //
      const res = await request(app)
        .post("/api/tld/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          tld: 123445,
        });
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
      //
      expect(res.body.errors.tld).toBeDefined();
    });
    it("should not enter invalid data #4", async () => {
      //
      const res = await request(app)
        .post("/api/tld/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          tld: { name: "Laith", age: 21 },
        });
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
      //
      expect(res.body.errors.tld).toBeDefined();
    });

    it("should not add TLD by user", async () => {
      //
      const res = await request(app)
        .post("/api/tld/create")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          tld: "xyz",
        });
      //
      expect(res.status).toBe(403);
      //
      expect(res.body.message).toBe("Forbidden");
    });

    it("should not add TLD without token", async () => {
      //
      const res = await request(app).post("/api/tld/create").send({
        tld: "xyz",
      });
      //
      expect(res.status).toBe(401);
      //
      expect(res.body.message).toBe("Please login first");
    });

    it("should not add TLD with invalid token", async () => {
      //
      const res = await request(app)
        .post("/api/tld/create")
        .set("Authorization", `Bearer ${adminToken}z`) // added z
        .send({
          tld: "xyz",
        });
      //
      expect(res.status).toBe(401);
      //
      expect(res.body.message).toBe("Invalid token");
    });

    it("should fail if add twice", async () => {
      await request(app)
        .post("/api/tld/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          tld: "xyz",
        });
      //
      const res = await request(app)
        .post("/api/tld/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          tld: "xyz",
        });
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("TLD already exists");
    });
  });

  describe("check", () => {
    it("admin can check TLD", async () => {
      //
      const res = await request(app)
        .get("/api/tld/check")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          domain: "click.xyz",
        });
      //
      expect(res.status).toBe(200);
      //
      expect(res.body.tld).toBe("xyz");
      //
      expect(res.body.details).toBeDefined();
    });

    it("user can check TLD", async () => {
      //
      const res = await request(app)
        .get("/api/tld/check")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          domain: "click.xyz",
        });
      //
      expect(res.status).toBe(200);
      //
      expect(res.body.tld).toBe("xyz");
      //
      expect(res.body.details).toBeDefined();
    });

    it("should not enter invalid data #1", async () => {
      //
      const res = await request(app)
        .get("/api/tld/check")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          domain: "123",
        });
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
      //
      expect(res.body.errors.domain).toBeDefined();
    });
    it("should not enter invalid data #2", async () => {
      //
      const res = await request(app)
        .get("/api/tld/check")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          domain: false,
        });
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
      //
      expect(res.body.errors.domain).toBeDefined();
    });
    it("should not enter invalid data #3", async () => {
      //
      const res = await request(app)
        .get("/api/tld/check")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          domain: ["1", null, undefined, false, 0, 2, 3],
        });
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
      //
      expect(res.body.errors.domain).toBeDefined();
    });
    it("should not enter invalid data #4", async () => {
      //
      const res = await request(app)
        .get("/api/tld/check")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          domain: undefined,
        });
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
      //
      expect(res.body.errors.domain).toBeDefined();
    });
    it("should not enter invalid data #5", async () => {
      //
      const res = await request(app)
        .get("/api/tld/check")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          domain: null,
        });
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
      //
      expect(res.body.errors.domain).toBeDefined();
    });

    it("can not check TLD without token", async () => {
      //
      const res = await request(app).get("/api/tld/check").send({
        domain: "click.xyz",
      });
      //
      expect(res.status).toBe(401);
      //
      expect(res.body.message).toBe("Please login first");
    });

    it("can not check TLD with invalid token", async () => {
      //
      const res = await request(app)
        .get("/api/tld/check")
        .set("Authorization", `Bearer ${adminToken}z`) // added z
        .send({
          domain: "click.xyz",
        });
      //
      expect(res.status).toBe(401);
      //
      expect(res.body.message).toBe("Invalid token");
    });
  });

  describe("delete", () => {
    //
    let tldId: string;
    //
    beforeEach(async () => {
      const tld = await TLD.create({
        tld: "xyz",
        source: new mongoose.Types.ObjectId(),
      });
      //
      tldId = tld._id.toString();
    });

    it("admin can delete TLD", async () => {
      //
      const res = await request(app)
        .delete(`/api/tld/${tldId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      //
      expect(res.status).toBe(204);
      //
      const exists = await TLD.findById(tldId);
      //
      expect(exists).toBeNull();
    });

    it("user can not delete TLD", async () => {
      //
      const res = await request(app)
        .delete(`/api/tld/${tldId}`)
        .set("Authorization", `Bearer ${userToken}`);
      //
      expect(res.status).toBe(403);
      //
      expect(res.body.message).toBe("Forbidden");
      //
      const exists = await TLD.findById(tldId);
      //
      expect(exists).not.toBeNull();
    });

    it("should not delete TLD without token", async () => {
      //
      const res = await request(app).delete(`/api/tld/${tldId}`);
      //
      expect(res.status).toBe(401);
      //
      expect(res.body.message).toBe("Please login first");
      //
      const exists = await TLD.findById(tldId);
      //
      expect(exists).not.toBeNull();
    });

    it("should not delete TLD with invalid token", async () => {
      //
      const res = await request(app)
        .delete(`/api/tld/${tldId}`)
        .set("Authorization", `Bearer ${adminToken}z`); // added z
      //
      expect(res.status).toBe(401);
      //
      expect(res.body.message).toBe("Invalid token");
      //
      const exists = await TLD.findById(tldId);
      //
      expect(exists).not.toBeNull();
    });

    it("should enter invalid data #1", async () => {
      //
      const res = await request(app)
        .delete(`/api/tld/invalid-id`)
        .set("Authorization", `Bearer ${adminToken}`);
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
    });

    it("should enter invalid data #2", async () => {
      //
      const res = await request(app)
        .delete(`/api/tld/123`)
        .set("Authorization", `Bearer ${adminToken}`);
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
    });
    it("should enter invalid data #3", async () => {
      //
      const res = await request(app)
        .delete(`/api/tld/abcdabcdabcd1234abcdfef`) // 23 characters not 24
        .set("Authorization", `Bearer ${adminToken}`);
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
    });
    it("should enter invalid data #4", async () => {
      //
      const res = await request(app)
        .delete(`/api/tld/abcdabcdabcd1234abcdfefef`) // 25 characters not 24
        .set("Authorization", `Bearer ${adminToken}`);
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
    });
    it("should enter invalid data #5", async () => {
      //
      const res = await request(app)
        .delete(`/api/tld/abcdabcdabcd123-abcdfefe`) // 24 characters not contains /^[0-9a-fA-F]+$/  This one contain "-"
        .set("Authorization", `Bearer ${adminToken}`);
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
    });

    it("should return 400 if TLD not found", async () => {
      //
      const fakeId = new mongoose.Types.ObjectId();
      //
      const res = await request(app)
        .delete(`/api/tld/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("TLD not found");
    });

    it("should fail if deleting twice", async () => {
      //
      await request(app)
        .delete(`/api/tld/${tldId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      //
      const res = await request(app)
        .delete(`/api/tld/${tldId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("TLD not found");
    });
  });
});
