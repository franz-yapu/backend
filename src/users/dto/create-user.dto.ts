import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'usuario@ejemplo.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;

   @ApiProperty({ example: 'username' })
  @IsString()
  @IsNotEmpty()
  username: string;


  @ApiProperty({ example: 'Juan', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Pérez', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Nombre del rol (USER por defecto)',
    enum: ['ADMIN', 'TEACHER', 'TUTOR', 'GUEST'],
    required: false
  })
  @IsOptional()
  @IsString()
  roleName?: string;
}