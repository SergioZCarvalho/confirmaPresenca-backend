import { ApiProperty } from '@nestjs/swagger';

class SendCodeDTO {
  @ApiProperty()
  code: string;

  @ApiProperty()
  newPassword: string;

  @ApiProperty()
  email: string;
}

export { SendCodeDTO };
