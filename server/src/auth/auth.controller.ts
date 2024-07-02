import {
  Body,
  Controller,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { AuthService, ITokenReturnBody, ITokenShape } from './auth.service';
import { LoginProfileDto } from './dto/login-profile.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Login Completed' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async login(@Body() payload: LoginProfileDto): Promise<ITokenReturnBody> {
    return this.authService.login(payload);
  }

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Registration Completed',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  register(
    @Body()
    signupPayload: CreateProfileDto,
  ): Promise<ITokenShape> {
    return this.authService.register(signupPayload);
  }

  @Post('refresh')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returned Refreshed Token',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  refresh(
    @Body() body: { userId: string },
  ): Promise<ITokenReturnBody> {
    return this.authService.refreshCompanyToken(body.userId);
  }
}
