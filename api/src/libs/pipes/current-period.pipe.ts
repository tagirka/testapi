import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ProfileService } from '@webapi/app/admin/profile/profile.service';
import { IPeriodQuery } from '../interfaces';

@Injectable()
export class CurrentPeriodPipe implements PipeTransform {
  constructor(private readonly profileService: ProfileService) {}
  async transform(
    { startmonth, startyear, endmonth, endyear }: IPeriodQuery,
    metadata: ArgumentMetadata
  ): Promise<IPeriodQuery> {
    const { currentMonth, currentYear } =
      await this.profileService.getCurrentPeriod();

    if (new Date(startyear, startmonth) > new Date(currentYear, currentMonth)) {
      startmonth = currentMonth;
      startyear = currentYear;
    }

    if (new Date(endyear, endmonth) > new Date(currentYear, currentMonth)) {
      endmonth = currentMonth;
      endyear = currentYear;
    }

    if (new Date(startyear, startmonth) > new Date(endyear, endmonth)) {
      startyear = endyear = currentYear;
      startmonth = endmonth = currentMonth;
    }

    return {
      startyear,
      startmonth,
      endmonth,
      endyear,
    };
  }
}
