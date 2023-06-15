import { Module } from '@nestjs/common';
import { ConfirmService } from './confirm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Confirm from './entity/confirm.entity';
import { ConfirmController } from './confirm.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Confirm])],
  providers: [ConfirmService],
  controllers: [ConfirmController],
})
export class ConfirmModule {}
