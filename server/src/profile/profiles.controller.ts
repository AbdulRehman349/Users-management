import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';
import { Profile } from 'src/decorators/profile.decorator';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  @ApiOperation({ summary: 'update profile data' })
  @ApiOkResponse({ description: 'Updates profile data', status: HttpStatus.OK })
  @Patch(':profileId')
  async update(
    @Body() body: UpdateProfileDto,
    @Param('profileId') profileId: string,
    @Profile() reqProfileId: string
  ) {
    return await this.profilesService.updateProfile(
      profileId,
      body,
      reqProfileId
    );
  }

  @ApiOperation({ summary: 'Gets all profiles' })
  @ApiOkResponse({ description: 'Gets all profiles', status: HttpStatus.OK })
  @Get()
  async getAll(
    @Query('query') query: string,
    @Query('page') page: string,
    @Profile() profileId: string
  ) {
    return await this.profilesService.getAllProfiles(query, page, profileId);
  }

  @Delete(':profileId')
  @ApiBearerAuth()
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Profile disabled successfully',
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profile not found',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to disable profile',
  })
  @ApiOperation({
    summary: 'Disables the profile of a company',
  })
  remove(
    @Param('profileId') profileId: string,
    @Profile() reqProfileId: string
  ) {

    return this.profilesService.disable(profileId, reqProfileId);
  }
}
