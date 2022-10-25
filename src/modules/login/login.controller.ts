import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginReqDto } from './dto/login.dto';
import { LoginService } from './login.service';
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  // 取得 Local JWT Token
  @Post('/token')
  async getTokenByUser(@Body() loginReqDto: LoginReqDto): Promise<RespBody> {
    return { data: await this.loginService.createToken(loginReqDto) };
  }

  // Token 換取資訊
  @Get('/local')
  @UseGuards(AuthGuard('jwt'))
  async getInfoByUser(@Request() req: any): Promise<RespBody> {
    return { data: req.user };
  }
}
