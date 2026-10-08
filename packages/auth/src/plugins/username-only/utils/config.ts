interface UsernameOnlyOptions {
  allowedUsername?: string;
  registrationEnabled?: boolean;
  minUsernameLength?: number;
  maxUsernameLength?: number;
  minPasswordLength?: number;
  maxPasswordLength?: number;
}

interface UsernameOnlyConfig {
  allowedUsername?: string;
  registrationEnabled: boolean;
  minUsernameLength: number;
  maxUsernameLength: number;
  minPasswordLength: number;
  maxPasswordLength: number;
}

const defaultOptions: UsernameOnlyConfig = {
  registrationEnabled: true,
  maxPasswordLength: 128,
  maxUsernameLength: 32,
  minPasswordLength: 8,
  minUsernameLength: 3,
};

const resolveConfig = (options?: UsernameOnlyOptions): UsernameOnlyConfig => ({
  ...defaultOptions,
  ...options,
});

export { resolveConfig };
export type { UsernameOnlyOptions, UsernameOnlyConfig };
