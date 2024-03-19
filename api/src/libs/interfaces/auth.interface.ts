export interface IJwtPayload {
  id: number;
  destination: string;
  refreshToken?: string;
  iat?: Date;
  exp?: Date;
}

export interface IJwtVerifyToken {
  type: string;
  destination: string;
  iat?: Date;
  exp?: Date;
  verifyToken?: string;
}

export type FindVerifyType = {
  id?: number;
  destination?: string;
  code?: number;
  type?: string;
  token?: string;
  isVerify?: boolean;
};

export enum VerifySelectEnum {
  email = 'email',
  phone = 'phone',
}
