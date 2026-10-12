import { InfoRepository } from '@/domain/info-repository';
import { fileInfoRepository } from './file-info-repository';

// Public services read Supabase through `listCatalogServices` / `getCatalogServiceBySlug`.
// Public /info reads Supabase through `listUsefulInfo` / `getUsefulInfoById`.
export const infoRepository: InfoRepository = fileInfoRepository;
