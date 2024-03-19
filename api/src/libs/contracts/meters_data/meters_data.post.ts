import { IsInt, IsNumber } from 'class-validator';

export namespace MetersDataPost {
  export const topic = 'meters_data.post.query';

  export class Request {
    @IsInt({ message: 'The value [els_id] must be an integer' })
    els_id: bigint;

    @IsInt({ message: 'The value [service_id] must be an integer' })
    service_id: number;

    @IsNumber()
    volume: number;
  }

  export class Response {
    id: bigint;
    els_id: bigint;
    service_id: number;
    volume: number;
    date_meter_reading: Date;
    date_entering: Date;
    exchange_code: string;
  }
}
