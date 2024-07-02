import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { getFindQueryProps } from '../helpers';
import {
  DisablePayloadType,
  FindPayloadType,
  UpdatePayloadType,
} from '../types';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile, ProfileDocument } from './profile.model';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfilesRepository {
  constructor(
    @InjectModel('Profile') private readonly profileModel: Model<Profile>,
  ) {}

  get(id: string): Promise<ProfileDocument> {
    return this.profileModel.findById(id).exec();
  }

  async create(payload: CreateProfileDto): Promise<ProfileDocument> {
    try {
      const user = await this.getByEmail(payload.email);
      if (user) {
        throw new NotAcceptableException(
          'The account with the provided email currently exists. Please choose another one.',
        );
      }
      const createdProfile = new this.profileModel(payload);
      return createdProfile.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  getByEmail(email: string): Promise<Profile> {
    return this.profileModel.findOne({ email }).exec();
  }

  async update(
    id: Types.ObjectId,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    try {
      return await this.profileModel
        .findOneAndUpdate({ _id: id }, updateProfileDto, { new: true })
        .lean()
        .exec();
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  async findOne(payload: FindPayloadType<Profile>): Promise<ProfileDocument> {
    try {
      const { filter, ref } = getFindQueryProps(payload);
      return await this.profileModel.findOne(filter).populate(ref).exec();
    } catch (err) {
      throw new BadRequestException(
        'Something went wrong while finding profile',
      );
    }
  }

  async disable(payload: DisablePayloadType<Profile>): Promise<Profile> {
    try {
      return await this.profileModel.findOneAndUpdate(
        payload.filter,
        payload.body,
        payload.options,
      );
    } catch (error) {
      throw new BadRequestException(
        `Something went wrong while disabling profile. Please try again later.`,
      );
    }
  }
  async findAll(payload: FindPayloadType<Profile>): Promise<ProfileDocument[]> {
    try {
      const { filter, ref, options } = getFindQueryProps(payload);
      return await this.profileModel.find(filter).populate(ref).limit(options.limit).skip(options.skip).exec();
    } catch (err) {
      throw new BadRequestException(
        'Something went wrong while finding profile',
      );
    }
  }

  async findAndUpdate(
    payload: UpdatePayloadType<ProfileDocument, UpdateProfileDto>,
  ): Promise<ProfileDocument> {
    try {
      return await this.profileModel
        .findOneAndUpdate(payload.filter, payload.body, payload.options)
        .populate(payload.ref)
        .exec();
    } catch (error) {
      throw new BadRequestException(
        `Something went wrong while updating estimate. Please try again later.`,
      );
    }
  }
}
