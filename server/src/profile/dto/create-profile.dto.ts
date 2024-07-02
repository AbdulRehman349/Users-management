import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateProfileDto {

  @ApiProperty({
    required: true,
  })
  @Matches(/^[a-zA-Z ]+$/)
  @IsNotEmpty()
  firstName: string;
  
  @ApiProperty({
    required: false,
  })
  @Matches(/^[a-zA-Z ]+$/)
  @IsOptional()
  middleName: string;
  
  @ApiProperty({
    required: true,
  })
  @Matches(/^[a-zA-Z ]+$/)
  @IsNotEmpty()
  lastName: string;
  
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

}
