import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Operation_DetailsService } from "./operation_details.service";

@ApiTags("Справочник операций.")
@Controller("operation_details")
export class Operation_DetailsController {
  constructor(private operation_detailsService: Operation_DetailsService) {}
}
