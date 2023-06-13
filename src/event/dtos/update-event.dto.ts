import { ApiProperty } from '@nestjs/swagger';
import User from 'src/user/entity/user.entity';
import ManageEventDTO from './manage-event.dto';

class UpdateEventDTO extends ManageEventDTO {}

export default UpdateEventDTO;
