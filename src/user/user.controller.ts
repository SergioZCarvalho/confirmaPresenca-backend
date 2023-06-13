import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/common/auth.guard';
import { UserDTO } from './dtos/user.dto';
import LoginDTO from './dtos/login.dto';
import { RegisterUserDTO } from './dtos/register.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';

import * as bcrypt from 'bcrypt';
import { AuthUser } from 'src/common/auth-user.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('me')
  getUserMe(@AuthUser() user) {
    return this.userService.getUserById(user.id);
  }

  @Delete(':id')
  DeleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @Put(':id')
  UpdateUser(@Param('id') id: string, @Body() user: UpdateUserDTO) {
    return this.userService.update(id, user);
  }

  @Post()
  async saveUser(@Body() user: RegisterUserDTO) {
    user.password = await bcrypt.hash(user.password, 10);
    const newUser = await this.userService.saveUser(user);
    return this.retrievePayload(newUser.id);
  }

  @Post('login')
  async login(@Body() model: LoginDTO) {
    const user = await this.userService.getUserByEmail(model.email);
    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);
    }
    const isPasswordValid = await bcrypt.compare(model.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Credenciais inválidas', HttpStatus.BAD_REQUEST);
    }
    return await this.retrievePayload(user.id);
  }

  async retrievePayload(id) {
    const retrieved = await this.userService.getUserById(id);
    const payload = {
      role: 'user',
      name: retrieved.name,
      email: retrieved.email,
      id: retrieved.id,
    };
    return {
      user: payload,
      access_token: this.jwtService.sign({
        data: payload,
      }),
    };
  }
}
