import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Confirm from './entity/confirm.entity';
import { Repository } from 'typeorm';
import confirmDTO from './dtos/confirm.dto';

@Injectable()
export class ConfirmService {
  constructor(
    @InjectRepository(Confirm) private confirmRepository: Repository<Confirm>,
  ) {}

  getConfirmByUserId(userId: string) {
    return this.confirmRepository
      .createQueryBuilder('confirm')
      .innerJoin('confirm.event', 'event')
      .innerJoin('event.creator', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  createConfirm(confirm: confirmDTO) {
    const confirmEvent = this.confirmRepository.create({
      ...confirm,
      event: { id: confirm.event },
    });
    return this.confirmRepository.save(confirmEvent);
  }

  async getConfirmByEmail(email: string): Promise<Confirm | undefined> {
    return this.confirmRepository.findOne({
      where: {
        email,
      },
    });
  }

  async updateConfirm(confirm: Confirm): Promise<Confirm> {
    return this.confirmRepository.save(confirm);
  }
}
