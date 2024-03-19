import { IsInt } from 'class-validator';

export namespace MetersDataGet {
  export const topic = 'meters_data.get.query';

  export class Request {
    @IsInt({ message: 'The value [els_id] must be an integer' })
    els_id: bigint;

    @IsInt({ message: 'The value [service_id] must be an integer' })
    service_id: number;
  }

  export class Response {
    els_id: bigint;
    service_id: number;
    volume: number;
    date_entering: Date;
  }
}
