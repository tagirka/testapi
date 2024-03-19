import {
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
  ValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw new UnprocessableEntityException(this.handleError(e.message));
        // CHECK & FIX
        // throw new UnprocessableEntityException(
        //   this.handleError(e.message.message),
        // );
      }
    }
  }

  private handleError(errors) {
    return errors.map((error) => error.constraints);
  }
}

@Injectable()
export class ParseYearPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }

    if (!/^2\d\d\d$/.test(value) || val < 2023)
      throw new BadRequestException('Year check failed');

    return val;
  }
}

@Injectable()
export class ParseMonthPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);

    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }

    if (!/^([1-9]|0[1-9]|1[0-2])$/.test(value))
      throw new BadRequestException('Month check failed');

    return val;
  }
}
