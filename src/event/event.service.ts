import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Event from './entity/event.entity';
import { Like, Repository } from 'typeorm';
import ManageEventDTO from './dtos/manage-event.dto';
import CreateEventDTO from './dtos/create-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
  ) {}

  createEvent(event: CreateEventDTO) {
    const createEvent = this.eventRepository.create({
      ...event,
      creator: {
        id: event.creator,
      },
    });
    return this.eventRepository.save(createEvent);
  }

  updateEvent(eventId: string, event: ManageEventDTO) {
    return this.eventRepository.update(eventId, event);
  }

  deleteEvent(eventId: string) {
    return this.eventRepository.delete(eventId);
  }

  getEventsByUser(userId: string) {
    return this.eventRepository.find({ where: { creator: { id: userId } } });
  }

  getEventByUser(userId: string, eventId: string) {
    return this.eventRepository.findOne({
      where: { id: eventId, creator: { id: userId } },
    });
  }

  getEventByUserSlug(slug: string) {
    return this.eventRepository.findOne({
      where: { slug },
    });
  }

  updateEventCover(eventId: string, cover: string) {
    return this.eventRepository
      .update(
        { id: eventId },
        {
          cover,
        },
      )
      .then((response) => response.raw[0]);
  }

  count(slug: string) {
    return this.eventRepository.count({
      where: {
        slug: Like(`${slug}%`),
      },
    });
  }
}
