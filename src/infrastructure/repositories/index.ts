import { ServiceRepository } from '@/domain/service-repository';
import { fileServiceRepository } from './file-service-repository';

// To enable admin later: switch to prismaServiceRepository here.
export const serviceRepository: ServiceRepository = fileServiceRepository;
