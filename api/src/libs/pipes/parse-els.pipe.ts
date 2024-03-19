import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseElsPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    const val = parseInt(value, 10);

    if (!/^74\d\d\d\d\d\d\d\d$/.test(val.toString())) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}
