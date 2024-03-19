import { IsNumber } from "class-validator";

export namespace AccountUserInfo {
  export const topic = "account.user-info.query";

  export class Request {
    @IsNumber()
    uid: number;
  }

  export class Response {
    lastName: string;

    firstName: string;

    patronymic: string;

    main_address: string;

    email: string;

    phone: string;

    email_confirmed: boolean;

    phone_confirmed: boolean;
  }
}
