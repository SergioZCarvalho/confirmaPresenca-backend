import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Event from './entity/event.entity';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), HttpModule],
  providers: [EventService, ConfigService],
  controllers: [EventController],
})
export class EventModule {}
