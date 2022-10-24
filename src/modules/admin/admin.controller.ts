import { AdminService } from './admin.service';
import { Controller, Post, UseGuards, Body, Put, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { createAdminReqDto, editAdminReqDto } from './dto/admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body: createAdminReqDto) {
    return this.adminService.createAdmin(body);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  edit(@Param('id') id: number, @Body() body: editAdminReqDto) {
    return this.adminService.editAdmin(id, body);
  }
}
