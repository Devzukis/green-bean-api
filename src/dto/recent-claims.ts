import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const GetRecentClaimsSchema = z.object({
  take: z.coerce.number().optional(),
  skip: z.coerce.number().optional(),
});

export class GetRecentClaimsDto extends createZodDto(GetRecentClaimsSchema) {}
