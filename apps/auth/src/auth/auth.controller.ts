import { Controller, Request, Post, UseGuards, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { LocalAuthGuard } from '../guards/local.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.signin(req.user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      domain: 'localhost',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signout(@Request() req, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
