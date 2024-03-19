export interface IMeterItem {
  meters_data_id: number;
  els_id: number;
  service_id: number;
  currentCheckDate: string; //Date
  volume: number;
}

export namespace MD_From_UsersCreate {
  export const topic = 'md_from_users.create.query';

  export class Request {
    id: number;
    volume: number;
  }

  export class Response {
    meters: IMeterItem[];
  }
}
