import { ApiProperty } from '@nestjs/swagger';
import User from 'src/user/entity/user.entity';

class ManageEventDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  startEvent: Date;

  @ApiProperty()
  endEvent: Date;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  number: number;

  @ApiProperty()
  zipCode: string;
}

export default ManageEventDTO;
