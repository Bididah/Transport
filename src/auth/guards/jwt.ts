import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      const code = info?.name;
      const message = info?.message;

      throw new UnauthorizedException({ code, message });
    }
    return user;
  }
}
