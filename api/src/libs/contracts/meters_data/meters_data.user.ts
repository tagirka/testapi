import { IElsItem } from '@webapi/libs/contracts';

export const enum DeviceColorEnum {
  CHECK_EXPIRED = 0,
  CHECK_COMPLETES = 1,
  CHECK_CONTINUES = 2,
}

export interface IMdAmount {
  quantity: number; // operation_details -> scope_service
  unit: string; // measure -> title
}
export interface IMdDetailsItem {
  id: number; // meters_data -> id (bigint)
  startPeriodIndications: number; // meters_data -> volume_previous_period
  enteredIndication: number; // operation_details -> sum_accrual
  individual_volume: number;
  desc: string; // meters_data -> additional_parameter1
  amount: IMdAmount;
}
export interface IMeters_DataItem {
  counterType: string; // meters_data -> fk_make_of_meter_id (join "make_of_meter")->type
  counterNumber: string; // meters_data -> fk_sn_of_meter_id (join "sn_of_meter")->sn
  nextCheckDate: string | null; // meters_data -> date_next_check (Date)
  isDeviceColor: DeviceColorEnum;
  vol_max_length: number; // meters_data -> scoreboard_meter
  enteredCheckDate: string | null; // meters_data -> date_previous_period (Date)
  currentCheckDate: string | null; // meters_data -> date_current_period (Date)
  accomodation: string; // meters_data -> additional_parameter2
  details: IMdDetailsItem[];
}
export namespace Meters_DataUser {
  export const topic = 'meters_data.user.query';

  export class Request {
    userId: string;
    start_year: number;
    start_month: number;
    end_year: number;
    end_month: number;
  }

  export class Response {
    els: IElsItem[];
  }
}

/* [
    {
        "id": 404,
        "els": "7400943663",
        "address": "Челябинская обл., Трехгорный, ул. Маршала Жукова, дом 4, кв. 32",
        "months": [
            {
                "billing_year": 2023,
                "billing_month": 8,
                "els_account": [
                    {
                        "id": "2235768",
                        "fk_service_id": 5,
                        "date_previous_period": "2023-08-21",
                        "volume_previous_period": "8130.000",
                        "volume_pre_previous_period": "0.000",
                        "date_current_period": null,
                        "date_next_check": null,
                        "scoreboard_meter": 5,
                        "additional_parameter1": "",
                        "additional_parameter2": "",
                        "type_meter": {
                            "type": "индивидуальный"
                        },
                        "sn_meters": {
                            "sn": "29473572"
                        },
                        "measure_meter": {
                            "title": "кВт.ч"
                        },
                        "service_meter": {
                            "id": 5,
                            "code_sus": "SE1",
                            "name_us": "Быт.потребление ЭЭ",
                            "company_service": {
                                "id": 14,
                                "code": "9001",
                                "name": "ООО \"\"Уралэнергосбыт\"\"",
                                "inn": "7453313477",
                                "address": "Банк ГПБ (АО), г.Москва, р/с 40702810200000032714, БИК 044525823, к/счёт 30101810200000000823",
                                "off_payment": 0
                            }
                        }
                    }
                ]
            },
            {
                "billing_year": 2023,
                "billing_month": 7,
                "els_account": [
                    {
                        "id": "5175750",
                        "fk_service_id": 5,
                        "date_previous_period": "2023-07-20",
                        "volume_previous_period": "8020.000",
                        "volume_pre_previous_period": "0.000",
                        "date_current_period": null,
                        "date_next_check": null,
                        "scoreboard_meter": 5,
                        "additional_parameter1": "",
                        "additional_parameter2": "",
                        "type_meter": {
                            "type": "индивидуальный"
                        },
                        "sn_meters": {
                            "sn": "29473572"
                        },
                        "measure_meter": {
                            "title": "кВт.ч"
                        },
                        "service_meter": {
                            "id": 5,
                            "code_sus": "SE1",
                            "name_us": "Быт.потребление ЭЭ",
                            "company_service": {
                                "id": 14,
                                "code": "9001",
                                "name": "ООО \"\"Уралэнергосбыт\"\"",
                                "inn": "7453313477",
                                "address": "Банк ГПБ (АО), г.Москва, р/с 40702810200000032714, БИК 044525823, к/счёт 30101810200000000823",
                                "off_payment": 0
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        "id": 1400629,
        "els": "7400803728",
        "address": "Челябинская обл., Верхний Уфалей, ул. Космонавтов, дом 32",
        "months": [
            {
                "billing_year": 2023,
                "billing_month": 8,
                "els_account": [
                    {
                        "id": "2693507",
                        "fk_service_id": 5,
                        "date_previous_period": "2023-08-16",
                        "volume_previous_period": "19686.000",
                        "volume_pre_previous_period": "0.000",
                        "date_current_period": null,
                        "date_next_check": null,
                        "scoreboard_meter": 5,
                        "additional_parameter1": "День",
                        "additional_parameter2": "",
                        "type_meter": {
                            "type": "индивидуальный"
                        },
                        "sn_meters": {
                            "sn": "450500"
                        },
                        "measure_meter": {
                            "title": "кВт.ч"
                        },
                        "service_meter": {
                            "id": 5,
                            "code_sus": "SE1",
                            "name_us": "Быт.потребление ЭЭ",
                            "company_service": {
                                "id": 14,
                                "code": "9001",
                                "name": "ООО \"\"Уралэнергосбыт\"\"",
                                "inn": "7453313477",
                                "address": "Банк ГПБ (АО), г.Москва, р/с 40702810200000032714, БИК 044525823, к/счёт 30101810200000000823",
                                "off_payment": 0
                            }
                        }
                    },
                    {
                        "id": "2693508",
                        "fk_service_id": 5,
                        "date_previous_period": "2023-08-16",
                        "volume_previous_period": "19934.000",
                        "volume_pre_previous_period": "0.000",
                        "date_current_period": null,
                        "date_next_check": null,
                        "scoreboard_meter": 5,
                        "additional_parameter1": "Ночь",
                        "additional_parameter2": "",
                        "type_meter": {
                            "type": "индивидуальный"
                        },
                        "sn_meters": {
                            "sn": "450500"
                        },
                        "measure_meter": {
                            "title": "кВт.ч"
                        },
                        "service_meter": {
                            "id": 5,
                            "code_sus": "SE1",
                            "name_us": "Быт.потребление ЭЭ",
                            "company_service": {
                                "id": 14,
                                "code": "9001",
                                "name": "ООО \"\"Уралэнергосбыт\"\"",
                                "inn": "7453313477",
                                "address": "Банк ГПБ (АО), г.Москва, р/с 40702810200000032714, БИК 044525823, к/счёт 30101810200000000823",
                                "off_payment": 0
                            }
                        }
                    }
                ]
            },
            {
                "billing_year": 2023,
                "billing_month": 7,
                "els_account": [
                    {
                        "id": "5362301",
                        "fk_service_id": 5,
                        "date_previous_period": "2023-07-19",
                        "volume_previous_period": "19546.000",
                        "volume_pre_previous_period": "0.000",
                        "date_current_period": null,
                        "date_next_check": null,
                        "scoreboard_meter": 5,
                        "additional_parameter1": "День",
                        "additional_parameter2": "",
                        "type_meter": {
                            "type": "индивидуальный"
                        },
                        "sn_meters": {
                            "sn": "450500"
                        },
                        "measure_meter": {
                            "title": "кВт.ч"
                        },
                        "service_meter": {
                            "id": 5,
                            "code_sus": "SE1",
                            "name_us": "Быт.потребление ЭЭ",
                            "company_service": {
                                "id": 14,
                                "code": "9001",
                                "name": "ООО \"\"Уралэнергосбыт\"\"",
                                "inn": "7453313477",
                                "address": "Банк ГПБ (АО), г.Москва, р/с 40702810200000032714, БИК 044525823, к/счёт 30101810200000000823",
                                "off_payment": 0
                            }
                        }
                    },
                    {
                        "id": "5362302",
                        "fk_service_id": 5,
                        "date_previous_period": "2023-07-19",
                        "volume_previous_period": "19809.000",
                        "volume_pre_previous_period": "0.000",
                        "date_current_period": null,
                        "date_next_check": null,
                        "scoreboard_meter": 5,
                        "additional_parameter1": "Ночь",
                        "additional_parameter2": "",
                        "type_meter": {
                            "type": "индивидуальный"
                        },
                        "sn_meters": {
                            "sn": "450500"
                        },
                        "measure_meter": {
                            "title": "кВт.ч"
                        },
                        "service_meter": {
                            "id": 5,
                            "code_sus": "SE1",
                            "name_us": "Быт.потребление ЭЭ",
                            "company_service": {
                                "id": 14,
                                "code": "9001",
                                "name": "ООО \"\"Уралэнергосбыт\"\"",
                                "inn": "7453313477",
                                "address": "Банк ГПБ (АО), г.Москва, р/с 40702810200000032714, БИК 044525823, к/счёт 30101810200000000823",
                                "off_payment": 0
                            }
                        }
                    }
                ]
            }
        ]
    }
] */
