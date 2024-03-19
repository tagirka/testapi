export enum RoleEnum {
  User = 'user',
  Admin = 'admin',
}

export interface IUser {
  id?: number;
  displayname?: string;
  email: string;
  password: string;
  refreshToken?: string;
  roles?: RoleEnum[];
  phone?: string;
  disable?: boolean;
  email_confirmed?: boolean;
  phone_confirmed?: boolean;
  registration_date?: Date;
  last_activity?: Date;
}

export type FindUserType = {
  email?: string;
  phone?: string;
  id?: number;
};

type DefaultValues = Pick<IUser, 'roles'>;

export const defaultUserValues: DefaultValues = {
  roles: [RoleEnum.User],
};
