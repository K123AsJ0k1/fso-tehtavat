const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});
});

describe("user", () => {
  test("a user is added", async () => {
    const test_user = {
      username: "Test",
      password: "Test",
      name: "Test",
    };

    await api
      .post("/api/users")
      .send(test_user)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const res = await api.get("/api/users");
    const usernames = res.body.map((user) => user.username);
    const names = res.body.map((user) => user.name);

    expect(usernames).toContain(test_user.username);
    expect(names).toContain(test_user.name);
  });

  test("username is too short", async () => {
    const test_user = {
      username: "Te",
      password: "Test",
      name: "Test",
    };
    const res = await api.post("/api/users").send(test_user).expect(400);
    expect(res.body.error).toBe(
      "username and password must be atleast 3 characters long"
    );
  });

  test("password is too short", async () => {
    const test_user = {
      username: "Test",
      password: "Te",
      name: "Test",
    };
    const res = await api.post("/api/users").send(test_user).expect(400);
    expect(res.body.error).toBe(
      "username and password must be atleast 3 characters long"
    );
  });
});

afterAll(() => {
  mongoose.connection.close();
});
