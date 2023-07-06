import Event from '../../event/entity/event.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  codeExp: Date;

  @OneToMany(() => Event, (Event) => Event.creator)
  @JoinColumn({ name: 'event_id' })
  events: Event[];
}

export default User;
