import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AdminLocalAuth } from './entities/admin-local-auth.entity';
import { AdminProfile } from './entities/admin-profile.entity';
import { AdminAuthRelation } from './entities/admin-auth-relation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      AdminProfile,
      AdminLocalAuth,
      AdminAuthRelation,
    ]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService, TypeOrmModule],
})
export class AdminModule {}
