import {
  NotificationTypeEnum,
  NotificationVisibilityEnum,
} from '@webapi/libs/constants/runtime/exception.constant';
export interface INotificationItem {
  id: number;
  title: string;
  text: string;
  type: NotificationTypeEnum;
  date?: string;
  isRead: boolean;
  visibility: NotificationVisibilityEnum;
  link?: string;
}
export interface IConstants {
  isReadings: boolean;
  notifications: INotificationItem[];
}
export interface IUser {
  userId: number; // user->id
  firstName: string; // user->firstname
  patronymic: string; // user->patronymic
  lastName: string; // user->lastname
  email: string; // user->email
  phone: string; // user->phone
  emailConfirmed: boolean; // user->email_confirmed
  phoneConfirmed: boolean; // user->phone_confirmed
  els: any[];
}

export namespace UserInfo {
  export const topic = 'user.info.query';

  export class Request {
    userId: string;
  }

  export class Response {
    user: IUser;
    constants: IConstants;
  }
}

/* const userInfo = {
  id: 3,
  last_name: 'Хасанов',
  first_name: 'Ильдар\n',
  patronymic: 'Сабирьянович',
  email: 'Khasanoff@mail.ru\n',
  phone: '89125366918',
  email_confirmed: true,
  phone_confirmed: true,
  els: [
    {
      id: 6,
      els: '7401770936',
      naming_els: {
        short_name: 'Ц. А. Г.',
        last_name: 'Ц',
        first_name: 'А',
        patronymic: 'Г',
      },
      build_els: {
        address_string: 'Челябинская обл., Копейск, Ул. Сутягина, дом 4, кв. 3',
      },
    },
    {
      id: 7,
      els: '7402285626',
      naming_els: {
        short_name: 'Т. Л. В.',
        last_name: 'Т',
        first_name: 'Л',
        patronymic: 'В',
      },
      build_els: {
        address_string:
          'Челябинская обл., Копейск, Ул. Российская, дом 27А, кв. 9',
      },
    },
  ],
}; */
