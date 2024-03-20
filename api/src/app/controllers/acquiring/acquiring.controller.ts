import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { OperationRepository } from '@webapi/app/modules/operation/operation.repository';

import { AcquiringCsvService } from '../../modules/acquiring/acquiring.csv.service';
import { AcquiringService } from '../../modules/acquiring/acquiring.service';
import { CreateCsvFileDto } from '../../modules/acquiring/dtos/create-csv-file.dto';
import { StartSessionDto } from '../../modules/acquiring/dtos/start_session.dto';
import { StatusSessionDto } from '../../modules/acquiring/dtos/status_session.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AccessTokenGuards } from '../auth/guards/access-token.guards';
import { IJwtPayload } from '@webapi/libs/interfaces';
import { User } from '../auth/decorators/user.decorator';

@ApiTags('Acquiring')
@Controller('acquiring')
export class AcquiringController {
  constructor(
    private readonly acquiringService: AcquiringService,
    private readonly acquiringCsvService: AcquiringCsvService,
    @InjectPinoLogger(AcquiringController.name)
    private readonly logger: PinoLogger,
    private readonly operationRepository: OperationRepository
  ) {}

  @ApiOperation({
    summary: 'Регистрация платежа',
  })
  @ApiResponse({ status: 200 })
  @UseGuards(AccessTokenGuards)
  @UsePipes(new ValidationPipe())
  @Post()
  startSession(
    @User() user: IJwtPayload,
    @Body() startSessionDto: StartSessionDto
  ) {
    // this.logger.info(host.toLowerCase());
    this.logger.info(`Acquiring startSessionDto ${startSessionDto}`);

    return this.acquiringService.startSession({
      ...startSessionDto,
      userId: user.id,
    });
  }

  @ApiOperation({
    summary: 'Статус платежной сессии',
  })
  @ApiResponse({ status: 200 })
  @UseGuards(AccessTokenGuards)
  @UsePipes(new ValidationPipe())
  @Get('status/:hash')
  statusSession(
    @Param('hash')
    hash: string
  ) {
    this.logger.info(`StatusSession status/:hash ${hash}`);

    return this.acquiringService.statusSession({ hash });
  }

  @ApiOperation({
    summary: 'Статус платежной сессии по orderId',
  })
  @ApiResponse({ status: 200 })
  @UseGuards(AccessTokenGuards)
  @UsePipes(new ValidationPipe())
  @Get('status_orderid')
  statusSessionByOrderId(
    //@User() user: IJwtPayload,
    @Body() statusSession: StatusSessionDto
  ) {
    this.logger.info(`StatusSession status_orderid`);

    return this.acquiringService.statusSessionByOrderId(statusSession);
  }

  @ApiOperation({
    summary: 'Формировние CSV-файла с платежами ВБРР.',
  })
  @ApiResponse({ status: 200 })
  // @UseGuards(AccessTokenGuards)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Get()
  getCsvFile(@Body() createCsvFileDto: CreateCsvFileDto) {
    this.logger.info('getCsvFile');
    const { fileName } = createCsvFileDto;
    return this.acquiringCsvService.getCsvFilesVBRR(fileName);
  }
}
