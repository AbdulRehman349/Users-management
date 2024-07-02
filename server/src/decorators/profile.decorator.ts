import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from 'src/common/config/config.service';

interface TokenData {
  _id?: string;
}

export const Profile = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    //Switch execution context to get access to http method: getRequest
    const request = ctx.switchToHttp().getRequest();
    const configService = new ConfigService('.env');
    //Retrieve request header
    const authHeader: string = request.headers.authorization;
    //Validate that whether the header is an auth header
    if (authHeader && authHeader.startsWith('Bearer ')) {
      //Extract token by removing Bearer part
      const token: string = authHeader.substring(7);
      try {
        //Verify token
        const tokenData = jwt.verify(
          token,
          configService.get('WEBTOKEN_SECRET_KEY'),
        ) as TokenData;

        if (tokenData && tokenData._id) {
          //Return profile id if verified
          return tokenData._id;
        }
      } catch (error) {
        console.error(error);
      }
    }

    return null;
  },
);
