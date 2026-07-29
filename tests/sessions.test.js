import { test, describe, after } from "node:test";
import assert from "node:assert";
import { getSession, registerStudent, searchSessions } from "../src/services/sessions.service.js";
import { sessionRepo } from "../src/DAL/sessions.dal.js";
import { userRepo } from "../src/DAL/users.dal.js";
import { client } from "../src/DB/mongoDB.js";

after(async () => {
  await client.close();
});

const fakeSession = { id: 1, topic: "Arduino", dateTime: "2026-08-10T09:00:00Z", capacity: 20 };
const fakeUser = { id: "student-1", firstName: "Moshe", lastName: "Levi", className: "12A" };

describe("sessions service - getSession", () => {
  test("session with no registrations returns count 0 and full capacity", async (t) => {
    t.mock.method(sessionRepo, "getById", async () => fakeSession);
    t.mock.method(sessionRepo, "countRegistrations", async () => 0);

    const session = await getSession(1);

    assert.strictEqual(session.registeredCount, 0);
    assert.strictEqual(session.remainingSpots, 20);
  });

  test("session with registrations returns updated counts", async (t) => {
    t.mock.method(sessionRepo, "getById", async () => fakeSession);
    t.mock.method(sessionRepo, "countRegistrations", async () => 12);

    const session = await getSession(1);

    assert.strictEqual(session.registeredCount, 12);
    assert.strictEqual(session.remainingSpots, 8);
  });

  test("throws 404 when session does not exist", async (t) => {
    t.mock.method(sessionRepo, "getById", async () => null);

    await assert.rejects(
      () => getSession(999),
      (err) => err.status === 404
    );
  });
});

describe("sessions service - searchSessions", () => {
  test("passes the filters to the DAL and returns its results", async (t) => {
    const search = t.mock.method(sessionRepo, "search", async () => [fakeSession]);

    const result = await searchSessions({ topic: "ardu", capacity: 10 });

    assert.deepStrictEqual(result, [fakeSession]);
    assert.deepStrictEqual(search.mock.calls[0].arguments[0], {
      topic: "ardu",
      capacity: 10,
    });
  });
});

describe("sessions service - registerStudent", () => {
  test("registers successfully and returns remaining spots", async (t) => {
    t.mock.method(userRepo, "getById", async () => fakeUser);
    t.mock.method(sessionRepo, "getById", async () => fakeSession);
    t.mock.method(sessionRepo, "isRegistered", async () => false);
    t.mock.method(sessionRepo, "countRegistrations", async () => 12);
    const addRegistration = t.mock.method(sessionRepo, "addRegistration", async () => {});
    const addSessionToUser = t.mock.method(userRepo, "addSessionToUser", async () => true);

    const result = await registerStudent(1, "student-1");

    assert.deepStrictEqual(result, { remainingSpots: 7 });
    assert.strictEqual(addRegistration.mock.callCount(), 1);
    assert.strictEqual(addSessionToUser.mock.callCount(), 1);
  });

  test("throws 404 when student does not exist", async (t) => {
    t.mock.method(userRepo, "getById", async () => null);

    await assert.rejects(
      () => registerStudent(1, "no-such-student"),
      (err) => err.status === 404
    );
  });

  test("throws 409 when student is already registered", async (t) => {
    t.mock.method(userRepo, "getById", async () => fakeUser);
    t.mock.method(sessionRepo, "getById", async () => fakeSession);
    t.mock.method(sessionRepo, "isRegistered", async () => true);

    await assert.rejects(
      () => registerStudent(1, "student-1"),
      (err) => err.status === 409
    );
  });

  test("throws 409 with remainingSpots 0 when session is full", async (t) => {
    t.mock.method(userRepo, "getById", async () => fakeUser);
    t.mock.method(sessionRepo, "getById", async () => fakeSession);
    t.mock.method(sessionRepo, "isRegistered", async () => false);
    t.mock.method(sessionRepo, "countRegistrations", async () => 20);
    const addSessionToUser = t.mock.method(userRepo, "addSessionToUser", async () => true);

    await assert.rejects(
      () => registerStudent(1, "student-1"),
      (err) => err.status === 409 && err.remainingSpots === 0
    );

    // rejected registration must not touch the student's data
    assert.strictEqual(addSessionToUser.mock.callCount(), 0);
  });

  test("rolls back the registration when updating the student fails", async (t) => {
    t.mock.method(userRepo, "getById", async () => fakeUser);
    t.mock.method(sessionRepo, "getById", async () => fakeSession);
    t.mock.method(sessionRepo, "isRegistered", async () => false);
    t.mock.method(sessionRepo, "countRegistrations", async () => 12);
    t.mock.method(sessionRepo, "addRegistration", async () => {});
    t.mock.method(userRepo, "addSessionToUser", async () => {
      throw new Error("mongo is down");
    });
    const removeRegistration = t.mock.method(sessionRepo, "removeRegistration", async () => {});

    await assert.rejects(
      () => registerStudent(1, "student-1"),
      (err) => err.status === 500
    );

    // the compensation must undo the postgres registration
    assert.strictEqual(removeRegistration.mock.callCount(), 1);
  });
});
