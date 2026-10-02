import { InfoRepository } from '@/domain/info-repository';
import { ServiceRepository } from '@/domain/service-repository';
import { fileInfoRepository } from './file-info-repository';
import { fileServiceRepository } from './file-service-repository';

// Services still read the local catalog. Public /info reads Supabase
// through `listUsefulInfo` / `getUsefulInfoById`, not this file repository.
export const serviceRepository: ServiceRepository = fileServiceRepository;
export const infoRepository: InfoRepository = fileInfoRepository;
