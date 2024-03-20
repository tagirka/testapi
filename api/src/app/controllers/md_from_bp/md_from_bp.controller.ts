import {
  Controller,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseElsPipe } from 'src/libs/pipes/parse-els.pipe';

import { MD_From_BPService } from '../../modules/md_from_bp/md_from_bp.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@ApiTags('Показания счетчиков. Информация от клиентов.')
@Controller('mdbp')
export class MD_From_BPController {
  constructor(
    @InjectPinoLogger(MD_From_BPController.name)
    private readonly logger: PinoLogger,
    private md_from_bpService: MD_From_BPService
  ) {}

  @ApiOperation({
    summary:
      'Получение показаний счетчиков по ЕЛС. Информация за последний месяц.',
  })
  @ApiResponse({ status: 200 })
  @UsePipes(new ValidationPipe())
  @Get('/:els')
  getMeters_Data(
    @Param('els', new ParseElsPipe())
    els: string
  ) {
    this.logger.info('getMeters_Data');
    return this.md_from_bpService.getMeters_Data_From_BP(els);
    //getMeters_Data_From_BP(els); reDirectBalance({ els });
  }
}
