import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/getToken')
  getTokenByUser(@Body() loginDto: LoginDto) {
    return this.loginService.createToken(loginDto);
  }

  @Post('/login/jwt')
  @UseGuards(AuthGuard('jwt'))
  async loginJWT(@Request() req: any): Promise<RespBody> {
    return {
      code: 200,
      message: '成功',
      data: req.user,
    };
  }
}
