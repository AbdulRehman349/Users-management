import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { ConfigService } from '../common/config/config.service';
import { Profile, ProfileDocument } from '../profile/profile.model';
import { ProfilesService } from '../profile/profiles.service';
import { CreateToken } from './auth.types';
import { LoginProfileDto } from './dto/login-profile.dto';

export interface ITokenShape {
  createdOn: string;
  expires: string;
  expiresPrettyPrint: string;
  token: string;
}

export interface ITokenReturnBody {
  user: Profile;
  backendTokens: ITokenShape;
}

export interface ITokenReturnBodyWidget
  extends Omit<ITokenReturnBody, 'companySubscription'> { }

@Injectable()
export class AuthService {
  private readonly expiration: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly profilesService: ProfilesService,
  ) {
    //24 hours in ms
    this.expiration = this.configService.get('WEBTOKEN_EXPIRATION_TIME');
  }
  private readonly logger = new Logger(AuthService.name);

  private static prettyPrintSeconds(time: string): string {
    const ntime = Number(time);
    const hours = Math.floor(ntime / 3600);
    const minutes = Math.floor((ntime % 3600) / 60);
    const seconds = Math.floor((ntime % 3600) % 60);

    return `${hours > 0 ? hours + (hours === 1 ? ' hour,' : ' hours,') : ''} ${minutes > 0 ? minutes + (minutes === 1 ? ' minute' : ' minutes') : ''
      } ${seconds > 0 ? seconds + (seconds === 1 ? ' second' : ' seconds') : ''}`;
  }

  async createToken({
    _id,
    email,
    firstName,
    lastName,
    //Expiry time in ms
    expireTime = this.expiration,
  }: CreateToken): Promise<ITokenShape> {
    const expirationInMilliseconds = Date.now() + Number(expireTime);

    return {
      //expiry in 24 hours
      createdOn: new Date().toISOString(),
      expires: expirationInMilliseconds.toString(),
      expiresPrettyPrint: AuthService.prettyPrintSeconds(expireTime),
      token: this.jwtService.sign({
        _id,
        email,
        firstName,
        lastName,
      }),
    };
  }

  async register(signupPayload: CreateProfileDto): Promise<ITokenShape> {
    try {
      const { email } = signupPayload;
      const emailExists = await this.profilesService.getByEmail(email);
      if (emailExists) throw new ConflictException('Email already exists');

      //Create Profile
      const createdUser = await this.profilesService.create(
        signupPayload
      );

      const tokenData = await this.createToken({
        _id: createdUser._id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
      });

      return tokenData;
    } catch (error) {
      this.logger.log('Internal error while signing up contractor', error);
      throw new BadRequestException(error.message);
    }
  }

  async validateLogin(payload: LoginProfileDto): Promise<{
    user: ProfileDocument;
  }> {
    const user = await this.profilesService.getByEmailAndPass(
      payload.email,
      payload.password,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Could not authenticate. Email or password is incorrect.',
      );
    }
    return { user };
  }

  async login(payload: LoginProfileDto): Promise<ITokenReturnBody> {
    try {
      const { user } =
        await this.validateLogin(payload);

      const { _id, firstName, lastName, email } = user;
      const backendTokens = await this.createToken({
        _id,
        email,
        firstName,
        lastName
      });
      return {
        user,
        backendTokens,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async refreshCompanyToken(userId: string): Promise<ITokenReturnBody> {
    try {
      const user =
        await this.profilesService.get(userId);

      const { _id, firstName, lastName, email } = user;

      const backendTokens = await this.createToken({
        _id,
        email,
        firstName,
        lastName
      });
      return {
        user,
        backendTokens,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
