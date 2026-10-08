import { describe, expect, it } from "vitest";
import { resolveAuthCapabilities } from "../src/capabilities";

describe("resolveAuthCapabilities", () => {
  it("uses username auth in non-commercial mode while preserving configured socials", () => {
    const capabilities = resolveAuthCapabilities({
      commercialMode: false,
      googleClientId: "google-client-id",
      googleClientSecret: "google-client-secret",
      microsoftClientId: "microsoft-client-id",
      microsoftClientSecret: "microsoft-client-secret",
      passkeyOrigin: "https://keeper.sh",
      passkeyRpId: "keeper.sh",
    });

    expect(capabilities).toEqual({
      commercialMode: false,
      credentialMode: "username",
      registrationEnabled: true,
      requiresEmailVerification: false,
      socialProviders: {
        google: true,
        microsoft: true,
      },
      supportsChangePassword: true,
      supportsPasskeys: false,
      supportsPasswordReset: false,
    });
  });

  it("enables email auth, passkeys, and configured socials in commercial mode", () => {
    const capabilities = resolveAuthCapabilities({
      commercialMode: true,
      googleClientId: "google-client-id",
      googleClientSecret: "google-client-secret",
      microsoftClientId: "microsoft-client-id",
      microsoftClientSecret: "microsoft-client-secret",
      passkeyOrigin: "https://keeper.sh",
      passkeyRpId: "keeper.sh",
    });

    expect(capabilities).toEqual({
      commercialMode: true,
      credentialMode: "email",
      registrationEnabled: true,
      requiresEmailVerification: true,
      socialProviders: {
        google: true,
        microsoft: true,
      },
      supportsChangePassword: true,
      supportsPasskeys: true,
      supportsPasswordReset: true,
    });
  });

  it("disables registration and social login in single-user mode", () => {
    const capabilities = resolveAuthCapabilities({
      commercialMode: false,
      googleClientId: "google-client-id",
      googleClientSecret: "google-client-secret",
      microsoftClientId: "microsoft-client-id",
      microsoftClientSecret: "microsoft-client-secret",
      singleUserUsername: "Richard",
    });

    expect(capabilities).toMatchObject({
      credentialMode: "username",
      registrationEnabled: false,
      socialProviders: { google: false, microsoft: false },
    });
  });
});
