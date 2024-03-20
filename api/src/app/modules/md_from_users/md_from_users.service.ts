import { Op } from 'sequelize';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as iconv from 'iconv-lite';
import { join } from 'path';
import { existsSync, writeFileSync } from 'fs';
//import * as fs from 'fs';

import { csvBpDateString } from '@webapi/libs/utils';
import {
  csvFileName,
  UES_CSV_SEPARATOR,
  UES_CSV_CODE_CASH,
  UES_CSV_OUT_FOLDER_NAME,
} from '@webapi/libs/constants/runtime/exception.constant';
import { MD_From_UsersCreate } from '@webapi/libs/contracts';
import { dateString } from '@webapi/libs/utils/helpers/date.helper';
//import { parseIntOrZero } from '@webapi/libs/utils';

import {
  MD_From_UsersEntity,
  ImdFromUsersCreationAttrs,
} from './entities/md_from_users.entity';
import { CreateMD_Dto } from './dto/create-md.dto';
import { GetLastMD_Dto } from './dto/get-last-md.dto';
import { CreateCsvFileMD_Dto } from './dto/create-csv-file.dto';

import { Meters_DataService } from '../meters_data/meters_data.service';
import { MD_FROM_USERS_REPOSITORY } from '@webapi/libs/constants';

@Injectable()
export class MD_From_UsersService {
  constructor(
    @Inject(MD_FROM_USERS_REPOSITORY)
    private md_from_usersRepository: typeof MD_From_UsersEntity,
    private meters_dataService: Meters_DataService
  ) {}

  async createMeters_Data(
    mdDtos: CreateMD_Dto[]
  ): Promise<MD_From_UsersCreate.Response> {
    if (mdDtos.length < 1)
      throw new BadRequestException('Пустой массив данных');

    const nowDate: Date = new Date();

    const addRows = await Promise.all(
      mdDtos.map(async (item) => {
        const { id, volume } = item;

        const mdInfo = await this.meters_dataService.findOne({ id });

        const {
          id: fk_meters_data_id,
          fk_els_id,
          fk_service_id,
          exchange_code,
        } = mdInfo;

        const row: ImdFromUsersCreationAttrs = {
          fk_els_id,
          fk_service_id,
          fk_meters_data_id,
          volume,
          date_meter_reading: nowDate,
          date_entering: nowDate,
          exchange_code,
        };

        return row;
      })
    );

    return await this.md_from_usersRepository
      .bulkCreate(addRows)
      .then((result) => {
        if (!result)
          throw new BadRequestException(
            'Пустой результат при записи данных по показаниям счетчиков'
          );

        return {
          meters: result.map((item) => {
            const {
              fk_els_id: els_id,
              fk_service_id: service_id,
              fk_meters_data_id,
              volume,
              date_entering: dateEntering,
            } = item;

            const currentCheckDate = !dateEntering
              ? null
              : dateString(new Date(dateEntering), {});

            return {
              meters_data_id: Number(fk_meters_data_id),
              els_id,
              service_id,
              currentCheckDate,
              volume: +volume,
            };
          }),
        };
      })
      .catch(() => {
        throw new BadRequestException(
          'Ошибка записи данных по показаниям счетчиков'
        );
      });
  }

  async getLastMeters_Data(mdDto: GetLastMD_Dto): Promise<any> {
    const { els_id: fk_els_id, service_id: fk_service_id } = mdDto;

    return await this.md_from_usersRepository
      .findOne({
        attributes: ['els_id', 'service_id', 'volume', 'date_entering'],
        where: {
          [Op.and]: {
            fk_els_id,
            fk_service_id,
          },
        },
        order: [['date_entering', 'DESC']],
      })
      .then((res) => res)
      .catch(() => {
        throw new BadRequestException('Database query error');
      });
  }

  async getCsvFile(mdDto: CreateCsvFileMD_Dto): Promise<boolean> {
    const { date_entry } = mdDto;
    const startDate = new Date(date_entry);
    const endDate = new Date(date_entry);
    endDate.setDate(endDate.getDate() + 1);

    const fileName = join(
      UES_CSV_OUT_FOLDER_NAME,
      csvFileName({ date_entering: startDate })
    );

    if (existsSync(fileName))
      throw new BadRequestException(`Found file with name ${fileName}`);

    const rows = await this.md_from_usersRepository
      .findAll({
        where: {
          date_entering: { [Op.between]: [startDate, endDate] },
        },
        order: [['date_entering', 'DESC']],
      })
      .then((res) => res)
      .catch(() => {
        throw new BadRequestException('Database query error');
      });

    const strFile = rows
      .map(
        (item) =>
          `"${item.exchange_code}"${UES_CSV_SEPARATOR}"${
            item.volume
          }"${UES_CSV_SEPARATOR}"${csvBpDateString(
            item.date_meter_reading
          )}"${UES_CSV_SEPARATOR}"${csvBpDateString(
            item.date_entering
          )}"${UES_CSV_SEPARATOR}"${UES_CSV_CODE_CASH}"`
      )
      .join('\n');

    const buf = iconv.encode(strFile, 'windows-1251');

    try {
      writeFileSync(fileName, buf);
    } catch {
      throw new BadRequestException(`Error writing file ${fileName}`);
    }
    return true;
  }
}
