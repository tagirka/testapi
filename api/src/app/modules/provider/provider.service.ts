import { Inject, Injectable } from "@nestjs/common";

import { PROVIDER_REPOSITORY } from "../../../libs/constants/repositories/repo.constant";
import { ProviderEntity } from "./entities/provider.entity";

@Injectable()
export class ProviderService {
  constructor(
    @Inject(PROVIDER_REPOSITORY)
    private readonly providerRepository: typeof ProviderEntity
  ) {}

  /* async getUserById(id: number): Promise<UserEntity> {
    const auth = await this.userRepository.findOne({
      where: { id },
      include: [NamingEntity],
    });
    return auth;
  } */
}
