import User from '../../user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('events')
class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  cover: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  startEvent: Date;

  @Column()
  endEvent: Date;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  number: number;

  @Column()
  zipCode: string;

  @ManyToOne(() => User, (User) => User.events)
  @JoinColumn({ name: 'user_id' })
  creator: User;
}

export default Event;
