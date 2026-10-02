import { InfoRepository } from '@/domain/info-repository';
import { ServiceRepository } from '@/domain/service-repository';
import { fileInfoRepository } from './file-info-repository';
import { fileServiceRepository } from './file-service-repository';

// To enable admin later: switch these to the dashboard repositories here.
export const serviceRepository: ServiceRepository = fileServiceRepository;
export const infoRepository: InfoRepository = fileInfoRepository;
