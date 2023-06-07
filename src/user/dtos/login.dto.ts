import { ApiProperty } from '@nestjs/swagger';

class LoginDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export default LoginDTO;
