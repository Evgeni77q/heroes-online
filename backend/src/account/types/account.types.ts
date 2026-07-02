export enum AccountStatus {
  PENDING_VERIFICATION = 'pending_verification',
  ACTIVE = 'active',
  LOCKED = 'locked',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

export interface Account {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  status: AccountStatus;

  emailVerified: boolean;
  emailVerifiedAt?: Date | null;

  failedLoginAttempts: number;
  lastLoginAt?: Date | null;
  lastLoginIp?: string | null;
  lockedUntil?: Date | null;

  twoFactorEnabled: boolean;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
