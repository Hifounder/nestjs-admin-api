import { MenuService } from './menu.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('menu')
@UseGuards(AuthGuard('jwt'))
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Get('/all')
  async name(): Promise<RespBody> {
    return { data: await this.menuService.getMenuList() };
  }
}
