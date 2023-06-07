import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { constants } from 'src/common/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: constants.jwtConstants.secret,
      signOptions: { expiresIn: '2592000s' },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
