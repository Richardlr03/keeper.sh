import { describe, expect, it } from "vitest";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { usernameOnly } from "../../src/plugins/username-only";

const BASE_URL = "http://localhost:3000";

const store = () => ({ account: [], session: [], user: [], verification: [] });

interface AuthHandler {
  handler: (request: Request) => Promise<Response>;
}

const post = (auth: AuthHandler, path: string, body: object) =>
  auth.handler(
    new Request(`${BASE_URL}/api/auth${path}`, {
      body: JSON.stringify(body),
      headers: { "content-type": "application/json", origin: BASE_URL },
      method: "POST",
    }),
  );

describe("username-only single-user mode", () => {
  it("rejects every registration attempt when registration is disabled", async () => {
    const database = store();
    const auth = betterAuth({
      baseURL: BASE_URL,
      database: memoryAdapter(database),
      plugins: [usernameOnly({ allowedUsername: "Richard", registrationEnabled: false })],
      secret: "test-secret",
    });

    const response = await post(auth, "/username-only/sign-up", {
      password: "password123",
      username: "Richard",
    });

    expect(response.status).toBe(403);
  });

  it("allows only the configured owner to sign in", async () => {
    const database = store();
    const setupAuth = betterAuth({
      baseURL: BASE_URL,
      database: memoryAdapter(database),
      plugins: [usernameOnly()],
      secret: "test-secret",
    });

    for (const username of ["Richard", "someone-else"]) {
      const response = await post(setupAuth, "/username-only/sign-up", {
        password: "password123",
        username,
      });
      expect(response.status).toBe(200);
    }

    const lockedAuth = betterAuth({
      baseURL: BASE_URL,
      database: memoryAdapter(database),
      plugins: [usernameOnly({ allowedUsername: "Richard", registrationEnabled: false })],
      secret: "test-secret",
    });

    const owner = await post(lockedAuth, "/username-only/sign-in", {
      password: "password123",
      username: "Richard",
    });
    const other = await post(lockedAuth, "/username-only/sign-in", {
      password: "password123",
      username: "someone-else",
    });

    expect(owner.status).toBe(200);
    expect(other.status).toBe(401);
  });
});
