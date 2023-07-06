import slugify from 'slugify';
import User from '../../user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';
import Confirm from 'src/confirm/entity/confirm.entity';

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
  state: string;

  @Column()
  zipCode: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  whatsapp: string;

  @Column()
  price: number;

  @Column()
  photos: string;

  @Column()
  localName: string;

  @ManyToOne(() => User, (User) => User.events)
  @JoinColumn({ name: 'user_id' })
  creator: User;

  @OneToMany(() => Confirm, (Confirm) => Confirm.event)
  @JoinColumn({ name: 'confirm_id' })
  confirms: Confirm[];
}

export default Event;
