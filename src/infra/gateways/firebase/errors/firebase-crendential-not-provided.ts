import { UseCaseError } from '@/core/errors/use-case-error';

export class FirebaseCredentialNotProvidedError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Firebase credential not provided');
  }
}
