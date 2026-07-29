import { test, describe, after } from "node:test";
import assert from "node:assert";
import { addUser, getUser } from "../src/services/users.service.js";
import { userRepo } from "../src/DAL/users.dal.js";
import { client } from "../src/DB/mongoDB.js";

after(async () => {
  await client.close();
});

describe("users service - addUser", () => {
  test("creates a user and returns its id", async (t) => {
    t.mock.method(userRepo, "getByFullName", async () => null);
    t.mock.method(userRepo, "create", async () => "fake-id-123");

    const id = await addUser({
      firstName: "Moshe",
      lastName: "Levi",
      className: "12A",
    });

    assert.strictEqual(id, "fake-id-123");
  });

  test("throws 409 when user already exists", async (t) => {
    t.mock.method(userRepo, "getByFullName", async () => ({
      id: "existing",
      firstName: "Moshe",
      lastName: "Levi",
    }));

    await assert.rejects(
      () => addUser({ firstName: "Moshe", lastName: "Levi", className: "12A" }),
      (err) => err.status === 409
    );
  });
});

describe("users service - getUser", () => {
  test("returns the user when it exists", async (t) => {
    t.mock.method(userRepo, "getById", async () => ({
      id: "fake-id-123",
      firstName: "Moshe",
      lastName: "Levi",
      className: "12A",
      labSessionsIds: ["1", "2"],
    }));

    const user = await getUser("fake-id-123");

    assert.strictEqual(user.firstName, "Moshe");
    assert.deepStrictEqual(user.labSessionsIds, ["1", "2"]);
  });

  test("throws 404 when user does not exist", async (t) => {
    t.mock.method(userRepo, "getById", async () => null);

    await assert.rejects(
      () => getUser("no-such-id"),
      (err) => err.status === 404
    );
  });
});
