import request from "supertest";
import app from "../../src/app";
import User from "../../src/modules/auth/user.model";

describe("Auth Api", () => {
  //
  test("register success #1", async () => {
    //
    const res = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "12345678",
    });
    //
    expect(res.status).toBe(201);
    //
    expect(res.body.token).toBeDefined();
  });

  test("register success #2: password should be hased", async () => {
    //
    await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "12345678",
    });
    //
    const user = await User.findOne({ email: "test@test.com" }).select(
      "+password"
    );
    //
    expect(user?.password).not.toBe("12345678");
  });

  test("register faild #1: password is short", async () => {
    //
    const res = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "1234567",
    });
    //
    expect(res.status).toBe(400);
    //
    expect(res.body.message).toBe("Validation error");
    //
    expect(res.body.errors.password).toBeDefined();
  });

  test("register faild #2: email not valid", async () => {
    //
    const res = await request(app).post("/api/auth/register").send({
      email: "test.com",
      password: "12345678",
    });
    //
    expect(res.status).toBe(400);
    //
    expect(res.body.message).toBe("Validation error");
    //
    expect(res.body.errors.email).toBeDefined();
  });

  test("register faild #3: email && password are not valid", async () => {
    //
    const res = await request(app).post("/api/auth/register").send({
      email: 123,
      password: true,
    });
    //
    expect(res.status).toBe(400);
    //
    expect(res.body.message).toBe("Validation error");
    //
    expect(res.body.errors.email).toBeDefined();
    //
    expect(res.body.errors.password).toBeDefined();
  });

  test("login success", async () => {
    //
    await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "12345678",
    });
    //
    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "12345678",
    });
    //
    expect(res.status).toBe(200);
    //
    expect(res.body.token).toBeDefined();
  });

  test("login faild #1: enter not exists email", async () => {
    //
    await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "12345678",
    });
    //
    const res = await request(app).post("/api/auth/login").send({
      email: "test@tes.com",
      password: "12345678",
    });
    //
    expect(res.status).toBe(401);
    //
    expect(res.body.message).toBe("Invalid credentials");
  });

  test("login faild #2: wrong password", async () => {
    //
    await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "12345678",
    });
    //
    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "12345677",
    });
    //
    expect(res.status).toBe(401);
    //
    expect(res.body.message).toBe("Invalid credentials");
  });

  test("login faild #3: invalid email && password", async () => {
    //
    const res = await request(app).post("/api/auth/login").send({
      email: "testtest.com",
      password: "1234567",
    });
    //
    expect(res.status).toBe(400);
    //
    expect(res.body.message).toBe("Validation error");
    //
    expect(res.body.errors.email).toBeDefined();
    //
    expect(res.body.errors.password).toBeDefined();
  });

  test("get me detail success", async () => {
    //
    const register = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "12345678",
    });
    //
    const token = register.body.token;
    //
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);
    //
    expect(res.status).toBe(200);
    //
    expect(res.body.email).toBeDefined();
    //
    expect(res.body.role).toBeDefined();
    //
    expect(res.body.id).toBeDefined();
  });

  test("get me detail faild #1: there is no token", async () => {
    //
    const res = await request(app).get("/api/auth/me");
    //
    expect(res.status).toBe(401);
    //
    expect(res.body.message).toBe("Please login first");
  });

  test("get me detail faild #2: Invalid Token", async () => {
    //
    const register = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "12345678",
    });
    //
    const token = register.body.token;
    //
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}z`); // added character
    //
    expect(res.status).toBe(401);
    //
    expect(res.body.message).toBe("Invalid token");
  });
});
