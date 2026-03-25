import AuthService from "../../src/modules/auth/user.service";
import User from "../../src/modules/auth/user.model";
import bcrypt from "bcryptjs";

jest.mock("../../src/modules/auth/user.model");

jest.mock("bcryptjs");

jest.mock("../../src/utils/jwt", () => ({
  generateToken: jest.fn(() => "token123"),
}));

describe("AuthService: ", () => {
  //
  let service: AuthService;
  //
  beforeEach(() => {
    //
    service = new AuthService();
  });
  //
  test("should register user", async () => {
    //
    (User.findOne as any).mockResolvedValue(null);
    //
    (User.create as any).mockResolvedValue({
      _id: "1",
      email: "test@test.com",
      role: "user",
    });
    //
    const result = await service.register("test@test.com", "12345678");
    //
    expect(result.token).toBeDefined();
    //
    expect(result.user.email).toBe("test@test.com");
  });

  test("should reject duplicate user", async () => {
    //
    (User.findOne as any).mockResolvedValue({
      email: "test@test.com",
    });
    //
    await expect(
      //
      service.register("test@test.com", "12345678")
      //
    )
      //
      .rejects.toThrow("User Exists");
  });

  test("should login", async () => {
    //
    (User.findOne as any).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "1",
        email: "test@test.com",
        password: "hashed",
        role: "user",
      }),
    });
    //
    (bcrypt.compare as any).mockResolvedValue(true);
    //
    const result = await service.login("test@test.com", "12345678");
    //
    expect(result.token).toBeDefined();
  });

  test("wrong password", async () => {
    //
    (User.findOne as any).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        password: "hashed",
      }),
    });
    //
    (bcrypt.compare as any).mockResolvedValue(false);
    //
    await expect(service.login("test@test.com", "12345678")).rejects.toThrow(
      "Invalid credentials"
    );
  });

  test("me success", async () => {
    //
    (User.findById as any).mockResolvedValue({
      email: "test@test.com",
      role: "user",
    });
    //
    const result = await service.me("1");
    //
    expect(result.email).toBe("test@test.com");
  });
});
