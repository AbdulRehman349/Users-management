import {
  BadRequestException,
  Injectable,
  Logger
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

import {
  encryptPassword,
} from '../helpers';
import { FindPayloadType } from '../types';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile, ProfileDocument } from './profile.model';
import { ProfilesRepository } from './profiles.repository';

/**
 * Profile Service
 */
@Injectable()
export class ProfilesService {
  /**
   * Constructor
   * @param {Model<Profile>} profileModel
   */
  constructor(
    private profileRepository: ProfilesRepository,
  ) { }
  private readonly logger = new Logger(ProfilesService.name);
  /**
   * Fetches a profile from database by UUID
   * @param {string} id
   * @returns {Promise<Profile>} queried profile data
   */

  // Fetches a profile from database by email
  getByEmail(email: string): Promise<ProfileDocument> {
    try {
      const payload: FindPayloadType<Profile> = {
        filter: {
          email,
        },
      };
      return this.profileRepository.findOne(payload);
    } catch (err) {
      this.logger.log('Error finding profile', err);
      throw new BadRequestException(
        'Something went wrong while finding profile',
      );
    }
  }


  // Creates profile of contractor on sign-up
  async create(
    registerProfileDto: CreateProfileDto,
  ): Promise<ProfileDocument> {
    try {
      const payload = {
        ...registerProfileDto,
        password: encryptPassword(registerProfileDto.password),
      };
      return this.profileRepository.create(payload);
    } catch (err) {
      this.logger.log('Error finding profile', err);
      throw new BadRequestException(
        'Something went wrong while creating profile',
      );
    }
  }

  get(id: string): Promise<ProfileDocument> {
    try {
      return this.profileRepository.get(id);
    } catch (err) {
      this.logger.log('Error finding profile', err);
      throw new BadRequestException(
        'Something went wrong while finding profile',
      );
    }
  }

  /**
   * Fetches a profile by their email and hashed password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Profile>} queried profile data
   */
  async getByEmailAndPass(
    email: string,
    password: string,
  ): Promise<ProfileDocument> {
    try {
      const payload: FindPayloadType<ProfileDocument> = {
        filter: {
          email,
          password: encryptPassword(password),
        },
      };

      return await this.profileRepository.findOne(payload);
    } catch (err) {
      this.logger.log('Error finding profile', err);
      throw new BadRequestException(
        'Something went wrong while finding profile',
      );
    }
  }

  async disable(profileId: string, reqProfileId: string): Promise<Profile> {
    try {
      if (profileId !== reqProfileId) throw new BadRequestException('Only own profile can be deleted')
      const profileObjectId = new ObjectId(profileId);
      return await this.profileRepository.update(
        profileObjectId,
        { deleted: true },
      );

    } catch (error) {
      this.logger.log(
        `Encountered error while deleting profile ${profileId}`,
        error,
      );
      throw new BadRequestException(
        `Something went wrong while deleting profile. Please try again later.`,
      );
    }
  }

  // Fetches all profiles
  async getAllProfiles(query: string, page: string, profileId: string): Promise<{ users: ProfileDocument[], totalCount: number }> {
    try {
      const limit = 5

      const searchQuery = new RegExp(query, 'i');

      const filter = {
        $and: [
          { deleted: false },
          { _id: { $ne: profileId } },
          {
            $or: [
              { firstName: { $regex: searchQuery } },
              { middleName: { $regex: searchQuery } },
              { lastName: { $regex: searchQuery } },
              { phoneNumber: { $regex: searchQuery } },
              { email: { $regex: searchQuery } }
            ]
          }
        ]
      }

      const options = {

        skip: (Number(page) - 1) * limit,
        limit: limit,
      }
      const payload: FindPayloadType<Profile> = {
        filter,
        options
      }

      const allUsers = await this.profileRepository.findAll(payload);
      const userCounts = await this.profileRepository.findAll({ filter });

      return { users: allUsers, totalCount: userCounts.length }
    } catch (err) {
      this.logger.log('Error finding profile', err);
      throw new BadRequestException(
        'Something went wrong while finding profile',
      );
    }
  }

  async updateProfile(
    profileId: string,
    body: UpdateProfileDto,
    reqProfileId: string
  ) {
    try {
      if (profileId !== reqProfileId) throw new BadRequestException('Only own profile can be updated')

      const profileObjectId = new ObjectId(profileId);

      const updateData = {
        ...body,
      };

      return await this.profileRepository.update(
        profileObjectId,
        updateData,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
