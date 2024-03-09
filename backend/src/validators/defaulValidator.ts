import { IsUUID } from 'class-validator';

export class UUIDValidator {
  @IsUUID()
  id: string;
}
