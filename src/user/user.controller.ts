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
import { SendEmailDTO } from './dtos/send-email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { addHours, isPast } from 'date-fns';
import { SendCodeDTO } from './dtos/send-code.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
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

  @Post('send-email')
  async sendEmail(@Body() model: SendEmailDTO) {
    const user = await this.userService.getByEmail(model.email);

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);
    }

    const code = Math.floor(100000 + Math.random() * 900000);

    await this.userService.updateCodeAndCodeExp(
      model.email,
      code.toString(),
      addHours(new Date(), 3),
    );

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      auth: {
        user: 'sergiozanata20@gmail.com',
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });

    const mailOptions = {
      from: '"Confirma Presença" <nao-responda@confirmapresenca.com.br>',
      to: model.email,
      subject: 'Código de verificação teste',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Código de Verificação</title>
          <style>
            body {
              background-color: #070d21;
              font-family: Arial, sans-serif;
            }
    
            .container {
              width: 400px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            h1 {
              color: #02BE67;
              text-align: center;
            }
    
            p {
              color: #333;
            }
    
            .code {
              font-size: 24px;
              font-weight: bold;
              text-align: center;
              margin-top: 20px;
              color: #02BE67;
            }
    
            .expiration {
              text-align: center;
              margin-top: 10px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Código de Verificação</h1>
            <p>Olá, ${user.name}</p>
            <p>Seu código de verificação é:</p>
            <p class="code">${code}</p>
            <p class="expiration">Este código expirará em 1 hora.</p>
          </div>
        </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        throw new HttpException(
          'Falha ao enviar o e-mail',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        console.log('E-mail enviado: ' + info.response);
        return { message: 'E-mail enviado com sucesso' };
      }
    });
  }

  @Post('send-code')
  async sendCode(@Body() model: SendCodeDTO) {
    const { email, code, newPassword } = model;

    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);
    }

    if (user.code !== code) {
      throw new HttpException(
        'Código de verificação inválido',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (isPast(user.codeExp)) {
      throw new HttpException(
        'Código de verificação expirado',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userService.updatePassword(user);

    return { message: 'Senha atualizada com sucesso' };
  }
}
