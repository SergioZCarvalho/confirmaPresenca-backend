import { ApiProperty } from '@nestjs/swagger';

class SendEmailDTO {
  @ApiProperty()
  email: string;
}

export { SendEmailDTO };
