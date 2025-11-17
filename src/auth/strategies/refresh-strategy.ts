import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { AuthPayLoad } from 'src/utils/types';

const getRefreshToken = (req: any) => req?.body?.refresh_token;

@Injectable()
export class RefreshAuthStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.['rt'] ?? null;
        },
      ]),
      secretOrKey: jwtConstants.serets.refresh,
      passReqToCallback: true,
    });
  }

  validate(req: any, payload: AuthPayLoad) {
    const { type, ...user } = payload;
    if (type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }
    const refreshToken = req?.cookies?.['rt'];
    return {
      id: user.sub,
      refreshToken,
    };
  }
}
