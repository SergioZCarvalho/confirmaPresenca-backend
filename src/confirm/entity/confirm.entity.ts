import Event from 'src/event/entity/event.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';

@Entity('confirms')
class Confirm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  hasAccepted: boolean;

  @ManyToOne(() => Event, (Event) => Event.confirms)
  @JoinColumn({ name: 'event_id' })
  event: Event;
}

export default Confirm;
