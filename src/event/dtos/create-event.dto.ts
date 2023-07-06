import { ApiProperty } from '@nestjs/swagger';
import User from 'src/user/entity/user.entity';
import ManageEventDTO from './manage-event.dto';

class CreateEventDTO extends ManageEventDTO {
  @ApiProperty()
  creator: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  photos: string;
}

export default CreateEventDTO;
