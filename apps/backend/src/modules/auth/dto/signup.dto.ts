import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address (must be unique)',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'Password (8-128 chars, 1 uppercase, 1 digit, 1 special char)',
  })
  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @MaxLength(128, {
    message: 'Le mot de passe ne doit pas dépasser 128 caractères',
  })
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
      'Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial',
  })
  password: string;

  @ApiProperty({
    example: 'Jean',
    description: 'First name (2-50 characters)',
  })
  @IsString()
  @MinLength(2, {
    message: 'Le prénom doit contenir au moins 2 caractères',
  })
  @MaxLength(50, {
    message: 'Le prénom ne doit pas dépasser 50 caractères',
  })
  firstName: string;

  @ApiProperty({
    example: 'Dupont',
    description: 'Last name (2-50 characters)',
  })
  @IsString()
  @MinLength(2, {
    message: 'Le nom doit contenir au moins 2 caractères',
  })
  @MaxLength(50, {
    message: 'Le nom ne doit pas dépasser 50 caractères',
  })
  lastName: string;
}
