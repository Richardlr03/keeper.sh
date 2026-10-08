import { authCapabilitiesSchema } from "@keeper.sh/data-schemas";
import type { AuthCapabilities } from "@keeper.sh/data-schemas";

interface ResolveAuthCapabilitiesConfig {
  commercialMode?: boolean;
  googleClientId?: string;
  googleClientSecret?: string;
  microsoftClientId?: string;
  microsoftClientSecret?: string;
  passkeyRpId?: string;
  passkeyOrigin?: string;
  singleUserUsername?: string;
}

const hasOAuthCredentials = (clientId?: string, clientSecret?: string): boolean =>
  Boolean(clientId && clientSecret);

const resolveCredentialMode = (
  commercialMode?: boolean,
): AuthCapabilities["credentialMode"] => {
  if (commercialMode) {
    return "email";
  }

  return "username";
};

const resolveAuthCapabilities = (
  config: ResolveAuthCapabilitiesConfig,
): AuthCapabilities => {
  const singleUserMode = Boolean(config.singleUserUsername);

  return authCapabilitiesSchema.assert({
    commercialMode: config.commercialMode ?? false,
    credentialMode: resolveCredentialMode(config.commercialMode),
    registrationEnabled: !singleUserMode,
    requiresEmailVerification: config.commercialMode ?? false,
    socialProviders: {
      google: !singleUserMode && hasOAuthCredentials(config.googleClientId, config.googleClientSecret),
      microsoft: !singleUserMode && hasOAuthCredentials(config.microsoftClientId, config.microsoftClientSecret),
    },
    supportsChangePassword: true,
    supportsPasskeys: Boolean(
      config.commercialMode && config.passkeyOrigin && config.passkeyRpId,
    ),
    supportsPasswordReset: config.commercialMode ?? false,
  });
};

export { resolveAuthCapabilities };
export type { ResolveAuthCapabilitiesConfig };
