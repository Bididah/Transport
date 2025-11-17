import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(200)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.register(dto);

    res.cookie('rt', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 15 * 24 * 3600 * 1000,
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      accessToken,
    };
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
    );

    res.cookie('rt', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 15 * 24 * 3600 * 1000,
    });

    return {
      user: {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
      },
      accessToken,
    };
  }

  @Post('refresh')
  @HttpCode(200)
  @UseGuards(AuthGuard('refresh'))
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.refresh(
      req.user.id,
      req.user.refreshToken,
    );
    res.cookie('rt', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 15 * 24 * 3600 * 1000,
    });

    return { accessToken };
  }

  @Get('me')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req) {
    return {
      user: {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
      },
    };
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user.id);
    res.clearCookie('rt', { path: '/api/auth/refresh' });
  }
}
