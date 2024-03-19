import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BalanceService } from './balance.service';

import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AccessTokenGuards } from '../auth/guards/access-token.guards';
import { IJwtPayload } from '@webapi/libs/interfaces';
import { User } from '../auth/decorators/user.decorator';

import { CurrentPeriodPipe } from '@webapi/libs/pipes/current-period.pipe';
import { QueryPeriodDto } from './dtos/query-period.dto';
import { setPeriod } from '@webapi/libs/utils/helpers/date.helper';
import { StatusGuard } from '@webapi/app/admin/profile/quards/status.quard';

@ApiTags('Balance')
@Controller('balance')
export class BalanceController {
  constructor(
    @InjectPinoLogger(BalanceController.name)
    private readonly logger: PinoLogger,
    private readonly balanceService: BalanceService
  ) {}

  @ApiOperation({
    summary: 'Получение ЛС и операции User',
  })
  @ApiResponse({ status: 200 })
  @UseGuards(AccessTokenGuards, StatusGuard)
  @Get('user')
  async getBalanceUser(
    @User() user: IJwtPayload,
    @Query(CurrentPeriodPipe) queryPeriodDto: QueryPeriodDto
  ) {
    return this.balanceService.getBalanceByUserId({
      id: user.id,
      period: setPeriod(queryPeriodDto),
    });
  }

  @ApiOperation({
    summary: 'Получение ЕЛС, ЛС и показаний счетчиков по User ID',
  })
  @ApiResponse({ status: 200 })
  @UseGuards(AccessTokenGuards)
  @Get('meters')
  async getMetersDataUser(
    @User() user: IJwtPayload,
    @Query(CurrentPeriodPipe) queryPeriodDto: QueryPeriodDto
  ) {
    return this.balanceService.getMetersDataByUserId({
      id: user.id,
      period: setPeriod(queryPeriodDto),
    });
  }
}
