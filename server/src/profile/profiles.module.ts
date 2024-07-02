import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Profile, ProfileModel } from './profile.model';
import { ProfilesController } from './profiles.controller';
import { ProfilesRepository } from './profiles.repository';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileModel, collection: 'profiles' },
    ]),
  ],
  providers: [ProfilesService, ProfilesRepository],
  exports: [ProfilesService],
  controllers: [ProfilesController],
})
export class ProfileModule {}
