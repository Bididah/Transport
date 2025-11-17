import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthPayLoad } from 'src/utils/types';
import { DataSource } from 'typeorm';
import { jwtConstants } from './constants';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @InjectDataSource() private readonly data: DataSource,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.userService.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      password: dto.password,
    });

    const tokens = await this.generateTokens({
      id: user.id,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
      role: user.role,
    } as User);

    const hashedRt = await bcrypt.hash(tokens.refreshToken, 12);
    await this.userService.update(
      { refreshTokenHash: hashedRt },
      { where: { id: user.id } },
    );

    return {
      user,
      ...tokens,
    };
  }

  async login(user: User) {
    const tokens = await this.generateTokens(user);
    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 12);
    await this.userService.update(
      { refreshTokenHash },
      { where: { id: user.id } },
    );
    return tokens;
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.userService.findOne({ where: { id: userId } });
    if (!user || !user.refreshTokenHash)
      throw new ForbiddenException('Access denied');

    const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!matches) throw new ForbiddenException('Invalid refresh token');

    const tokens = await this.generateTokens({
      id: user.id,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
      role: user.role,
    } as User);

    const newHashedRT = await bcrypt.hash(refreshToken, 12);
    this.userService.update(
      { refreshTokenHash: newHashedRT },
      { where: { id: user.id } },
    );

    return tokens;
  }

  async logout(id: string) {
    await this.userService.update(
      { refreshTokenHash: null },
      { where: { id } },
    );
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne({ where: { email } });
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  private async generateTokens(user: User) {
    const base: Partial<AuthPayLoad> = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(
      {
        ...base,
        type: 'access',
      },
      {
        secret: jwtConstants.serets.access,
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        ...base,
        type: 'refresh',
      },
      {
        secret: jwtConstants.serets.refresh,
        expiresIn: '15d',
      },
    );

    return { accessToken, refreshToken };
  }
}
