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

  async createEvent(event: CreateEventDTO): Promise<Event> {
    try {
      const createEvent = this.eventRepository.create({
        ...event,
        creator: {
          id: event.creator,
        },
        confirms: [],
      });
      const saved = await this.eventRepository.save(createEvent);
      return saved;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw new Error(
        'Erro ao criar evento. Por favor, verifique os dados fornecidos.',
      );
    }
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

  getEventBySlug(slug: string) {
    return this.eventRepository.findOne({
      where: { slug },
    });
  }

  getEventById(id: string) {
    return this.eventRepository.findOne({
      where: { id },
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

  getConfirmsByEvent(eventId: string) {
    return this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.confirms', 'confirms')
      .where('event.id = :eventId', { eventId })
      .getOne();
  }
}
