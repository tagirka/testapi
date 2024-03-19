import { IsString } from "class-validator";

export namespace Business_PaymentsPdf {
  export const topic = "business_payments.pdf.query";

  export class Request {
    @IsString()
    code: string;
    @IsString()
    date: string;
  }

  export class Response {
    data: string;
  }
}
