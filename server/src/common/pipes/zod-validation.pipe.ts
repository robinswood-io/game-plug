import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

/**
 * Zod Validation Pipe
 * Validates request bodies against Zod schemas
 * Accepts any object with a parse method (including drizzle-zod schemas)
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: { parse: (value: unknown) => any }) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: error,
      });
    }
  }
}
