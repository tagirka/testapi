import {
  Body,
  Controller,
  Get,
  Post,
  ParseArrayPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MD_From_UsersService } from '../../modules/md_from_users/md_from_users.service';

import { CreateMD_Dto } from '../../modules/md_from_users/dto/create-md.dto';
//import { GetLastMD_Dto } from './dto/get-last-md.dto';
import { CreateCsvFileMD_Dto } from '../../modules/md_from_users/dto/create-csv-file.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@ApiTags('Показания счетчиков. Информация от пользователей.')
@Controller('mduser')
export class MD_From_UsersController {
  constructor(
    @InjectPinoLogger(MD_From_UsersController.name)
    private readonly logger: PinoLogger,
    private md_from_usersService: MD_From_UsersService
  ) {}

  @ApiOperation({
    summary: 'Получение показаний счетчиков от пользователей.',
  })
  @ApiResponse({ status: 200 })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post()
  createMeters_Data(
    @Body(new ParseArrayPipe({ items: CreateMD_Dto })) mdDtos: CreateMD_Dto[]
  ) {
    this.logger.info('createMeters_Data');
    return this.md_from_usersService.createMeters_Data(mdDtos);
  }

  /*  @ApiOperation({
    summary:
      'Получение последних показаний счетчика, пререданных пользователем.',
  })
  @ApiResponse({ status: 200 })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Get()
  getMeters_Data(@Body() mdDto: GetLastMD_Dto) {
    return this.md_from_usersService.getLastMeters_Data(mdDto);
  } */

  @ApiOperation({
    summary: 'Формировние CSV-файла с показаниями счетчика.',
  })
  @ApiResponse({ status: 200 })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Get()
  getCsvFile(@Body() mdDto: CreateCsvFileMD_Dto) {
    this.logger.info('getCsvFile');
    return this.md_from_usersService.getCsvFile(mdDto);
  }
}
