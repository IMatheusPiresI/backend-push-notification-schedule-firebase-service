import { UseCaseError } from '@/core/errors/use-case-error';

export class FirebaseModuleNotInitializedError
  extends Error
  implements UseCaseError
{
  constructor(moduleName: string) {
    super(`Firebase ${moduleName} not initialized`);
  }
}
