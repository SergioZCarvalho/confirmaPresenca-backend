import { ApiProperty } from '@nestjs/swagger';

class confirmDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  event: string;
}

export default confirmDTO;
