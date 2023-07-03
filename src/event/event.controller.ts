import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/common/auth-user.decorator';
import ManageEventDTO from './dtos/manage-event.dto';
import { EventService } from './event.service';
import { AuthGuard } from 'src/common/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { constants } from 'src/common/constants';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import CreateEventDTO from './dtos/create-event.dto';
import UpdateEventDTO from './dtos/update-event.dto';
import slugify from 'slugify';

@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(
    private eventService: EventService,
    private configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async createEvent(@AuthUser() user, @Body() event: CreateEventDTO) {
    let slug = slugify(event.name, {
      replacement: '-',
      lower: true,
      strict: true,
    });

    const slugCount = await this.eventService.count(slug);
    if (slugCount > 0) {
      slug = `${slug}_${slugCount}`;
    }

    const eventCreate = this.eventService.createEvent({
      ...event,
      creator: user.data.id,
      slug,
    });
    return eventCreate;
  }

  @UseGuards(AuthGuard)
  @Get()
  listUserEvents(@AuthUser() user) {
    return this.eventService.getEventsByUser(user.data.id);
  }

  @Get(':slug')
  listUserEventSlug(@Param('slug') slug: string) {
    return this.eventService.getEventByUserSlug(slug);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateEvent(
    @AuthUser() user,
    @Param('id') id: string,
    @Body() event: UpdateEventDTO,
  ) {
    try {
      const eventQuery = await this.eventService.getEventByUser(
        user.data.id,
        id,
      );
      if (!eventQuery) {
        throw new UnauthorizedException();
      }
      const updatedEvent = await this.eventService.updateEvent(id, event);
      return updatedEvent;
    } catch (ex) {
      console.log(ex.message);
      if (
        ex instanceof BadRequestException ||
        ex instanceof UnauthorizedException
      ) {
        throw ex;
      }
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteEvent(@AuthUser() user, @Param('id') id: string) {
    try {
      const eventQuery = await this.eventService.getEventByUser(
        user.data.id,
        id,
      );
      if (!eventQuery) {
        throw new UnauthorizedException();
      }
      const deletedEvent = await this.eventService.deleteEvent(id);
      return deletedEvent;
    } catch (ex) {
      console.log(ex.message);
      if (
        ex instanceof BadRequestException ||
        ex instanceof UnauthorizedException
      ) {
        throw ex;
      }
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user,
    @Body('event') event: string,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
      const eventQuery = await this.eventService.getEventByUser(
        user.data.id,
        event,
      );
      if (!eventQuery) {
        throw new UnauthorizedException();
      }
      const allowedExtensions = ['.jpg', '.png', '.jpeg', '.jfif', '.webp'];
      const fileExt = file.originalname.split('.').pop().toLowerCase();
      console.log('fileExt', fileExt);
      if (!allowedExtensions.includes(`.${fileExt}`)) {
        throw new BadRequestException('Unsupported file type');
      }
      const S3 = new S3Client({
        region: 'auto',
        endpoint: `https://${this.configService.get(
          'ACCOUNT_ID',
        )}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: this.configService.get('R2_ACCESS_KEY_ID'),
          secretAccessKey: this.configService.get('R2_SECRET_ACCESS_KEY'),
        },
      });

      const fileBuffer = Uint8Array.from(file.buffer);

      const bucket = 'confirmapresenca';
      const key = `${event}/cover.${fileExt}`;

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: file.mimetype,
      });
      await S3.send(command);

      const url = `https://pub-a4dfb888e4ba48e4a9783c33acea4fca.r2.dev/${key}`;
      const updatedEvent = await this.eventService.updateEventCover(event, url);
      return updatedEvent;
    } catch (ex) {
      console.log(ex.message);
      if (
        ex instanceof BadRequestException ||
        ex instanceof UnauthorizedException
      ) {
        throw ex;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }
}
