import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import Spam from "../../src/modules/spam/spam.model";
import Trie from "../../src/ds/trie";
import { setDetector } from "../../src/core/detector.instance";
import { SpamDetector } from "../../src/core/spam.detector";
import { generateTestToken } from "../utils/test.token";

describe("Spam Api", () => {
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
    it("should add spam domain by admin", async () => {
      //
      const res = await request(app)
        .post("/api/spam/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          domain: "click.xyz",
        });
      //
      expect(res.status).toBe(201);
      //
      expect(res.body.domain).toBe("click.xyz");
      //
      expect(res.body.normalized).toBeDefined();
    });

    it("should not enter invalid data #1", async () => {
      //
      const res = await request(app)
        .post("/api/spam/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          domain: "",
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
        .post("/api/spam/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          domain: true,
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
        .post("/api/spam/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          domain: 123445,
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
        .post("/api/spam/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          domain: { name: "Laith", age: 21 },
        });
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
      //
      expect(res.body.errors.domain).toBeDefined();
    });

    it("should not add spam domain by user", async () => {
      //
      const res = await request(app)
        .post("/api/spam/create")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          domain: "click.xyz",
        });
      //
      expect(res.status).toBe(403);
      //
      expect(res.body.message).toBe("Forbidden");
    });

    it("should not add spam domain without token", async () => {
      //
      const res = await request(app).post("/api/spam/create").send({
        domain: "click.xyz",
      });
      //
      expect(res.status).toBe(401);
      //
      expect(res.body.message).toBe("Please login first");
    });

    it("should not add spam domain with invalid token", async () => {
      //
      const res = await request(app)
        .post("/api/spam/create")
        .set("Authorization", `Bearer ${adminToken}z`) // added z
        .send({
          domain: "click.xyz",
        });
      //
      expect(res.status).toBe(401);
      //
      expect(res.body.message).toBe("Invalid token");
    });

    it("should fail if add twice", async () => {
      await request(app)
        .post("/api/spam/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          domain: "click.xyz",
        });
      //
      const res = await request(app)
        .post("/api/spam/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          domain: "click.xyz",
        });
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Domain already exists");
    });
  });

  describe("check", () => {
    it("admin can check spam", async () => {
      //
      const res = await request(app)
        .get("/api/spam/check")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          domain: "click.xyz",
        });
      //
      expect(res.status).toBe(200);
      //
      expect(res.body.domain).toBe("click.xyz");
      //
      expect(res.body.details).toBeDefined();
    });

    it("user can check spam", async () => {
      //
      const res = await request(app)
        .get("/api/spam/check")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          domain: "click.xyz",
        });
      //
      expect(res.status).toBe(200);
      //
      expect(res.body.domain).toBe("click.xyz");
      //
      expect(res.body.details).toBeDefined();
    });

    it("should not enter invalid data #1", async () => {
      //
      const res = await request(app)
        .get("/api/spam/check")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          domain: "",
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
        .get("/api/spam/check")
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
        .get("/api/spam/check")
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
        .get("/api/spam/check")
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
        .get("/api/spam/check")
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

    it("can not check spam domain without token", async () => {
      //
      const res = await request(app).get("/api/spam/check").send({
        domain: "click.xyz",
      });
      //
      expect(res.status).toBe(401);
      //
      expect(res.body.message).toBe("Please login first");
    });

    it("can not check spam domain with invalid token", async () => {
      //
      const res = await request(app)
        .get("/api/spam/check")
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
    let spamId: string;
    //
    beforeEach(async () => {
      const spam = await Spam.create({
        domain: "spam.com",
        normalized: "spam.com",
        source: new mongoose.Types.ObjectId(),
      });
      //
      spamId = spam._id.toString();
    });

    it("admin can delete spam domain", async () => {
      //
      const res = await request(app)
        .delete(`/api/spam/${spamId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      //
      expect(res.status).toBe(204);
      //
      const exists = await Spam.findById(spamId);
      //
      expect(exists).toBeNull();
    });

    it("user can not delete spam domain", async () => {
      //
      const res = await request(app)
        .delete(`/api/spam/${spamId}`)
        .set("Authorization", `Bearer ${userToken}`);
      //
      expect(res.status).toBe(403);
      //
      expect(res.body.message).toBe("Forbidden");
      //
      const exists = await Spam.findById(spamId);
      //
      expect(exists).not.toBeNull();
    });

    it("should not delete spam domain without token", async () => {
      //
      const res = await request(app).delete(`/api/spam/${spamId}`);
      //
      expect(res.status).toBe(401);
      //
      expect(res.body.message).toBe("Please login first");
      //
      const exists = await Spam.findById(spamId);
      //
      expect(exists).not.toBeNull();
    });

    it("should not delete spam domain with invalid token", async () => {
      //
      const res = await request(app)
        .delete(`/api/spam/${spamId}`)
        .set("Authorization", `Bearer ${adminToken}z`); // added z
      //
      expect(res.status).toBe(401);
      //
      expect(res.body.message).toBe("Invalid token");
      //
      const exists = await Spam.findById(spamId);
      //
      expect(exists).not.toBeNull();
    });

    it("should enter invalid data #1", async () => {
      //
      const res = await request(app)
        .delete(`/api/spam/invalid-id`)
        .set("Authorization", `Bearer ${adminToken}`);
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
    });

    it("should enter invalid data #2", async () => {
      //
      const res = await request(app)
        .delete(`/api/spam/123`)
        .set("Authorization", `Bearer ${adminToken}`);
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
    });
    it("should enter invalid data #3", async () => {
      //
      const res = await request(app)
        .delete(`/api/spam/abcdabcdabcd1234abcdfef`) // 23 characters not 24
        .set("Authorization", `Bearer ${adminToken}`);
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
    });
    it("should enter invalid data #4", async () => {
      //
      const res = await request(app)
        .delete(`/api/spam/abcdabcdabcd1234abcdfefef`) // 25 characters not 24
        .set("Authorization", `Bearer ${adminToken}`);
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
    });
    it("should enter invalid data #5", async () => {
      //
      const res = await request(app)
        .delete(`/api/spam/abcdabcdabcd123-abcdfefe`) // 24 characters not contains /^[0-9a-fA-F]+$/  This one contain "-"
        .set("Authorization", `Bearer ${adminToken}`);
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Validation error");
    });

    it("should return 400 if domain not found", async () => {
      //
      const fakeId = new mongoose.Types.ObjectId();
      //
      const res = await request(app)
        .delete(`/api/spam/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Domain not found");
    });

    it("should fail if deleting twice", async () => {
      //
      await request(app)
        .delete(`/api/spam/${spamId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      //
      const res = await request(app)
        .delete(`/api/spam/${spamId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      //
      expect(res.status).toBe(400);
      //
      expect(res.body.message).toBe("Domain not found");
    });
  });
});
