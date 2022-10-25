import { AdminService } from './admin.service';
import {
  Controller,
  Post,
  UseGuards,
  Body,
  Put,
  Param,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateAdminReqDto,
  EditAdminReqDto,
  GetAdminListReqDto,
} from './dto/admin.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  // 後台人員列表
  @Get('/')
  async getAdminList(@Query() dto: GetAdminListReqDto): Promise<RespBody> {
    return { data: await this.adminService.getAdminList(dto) };
  }
  // 後台人員資訊
  @Get('/:id')
  async getAdminInfo(@Param('id') id: number): Promise<RespBody> {
    return { data: await this.adminService.getAdminInfo(id) };
  }
  // 新增後台人員
  @Post('/')
  async createAdmin(@Body() dto: CreateAdminReqDto): Promise<RespBody> {
    return { data: await this.adminService.createAdmin(dto) };
  }
  // 修改後台人員
  @Put('/:id')
  async editAdmin(
    @Param('id') id: number,
    @Body() dto: EditAdminReqDto,
  ): Promise<RespBody> {
    return { data: await this.adminService.editAdmin(id, dto) };
  }
  // 刪除後台人員(改狀態)
  @Delete('/:id')
  async deleteAdmin(@Param('id') id: number): Promise<RespBody> {
    return { data: await this.adminService.deleteAdmin(id) };
  }
}
