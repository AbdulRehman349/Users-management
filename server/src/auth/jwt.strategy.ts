import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { ConfigService } from '../common/config/config.service';
import { Profile } from '../profile/profile.model';
import { ProfilesService } from '../profile/profiles.service';
import { JwtPayload } from 'src/types';


/**
 * Jwt Strategy Class
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor
   * @param {ConfigService} configService
   * @param {ProfilesService} profilesService
   */
  constructor(
    readonly configService: ConfigService,
    private readonly profilesService: ProfilesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('WEBTOKEN_SECRET_KEY'),
    });
  }

  /**
   * Checks if the bearer token is a valid token
   * @param {JwtPayload} jwtPayload validation method for jwt token
   * @param {any} done callback to resolve the request user with
   * @returns {Promise<boolean>} whether or not to validate the jwt token
   */
  async validate(
    { iat, exp, _id }: JwtPayload,
    done: (arg0: null, arg1: Profile) => void,
  ): Promise<boolean> {
    const timeDiff = exp - iat;
    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }

    const user = await this.profilesService.get(_id);
    if (!user) {
      throw new UnauthorizedException();
    }

    done(null, user);
    return true;
  }
}
