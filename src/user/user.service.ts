import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entity/user.entity';
import { Not, Repository } from 'typeorm';
import { UserDTO } from './dtos/user.dto';
import { RegisterUserDTO } from './dtos/register.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  getAll() {
    return this.userRepository.find();
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async getUserByName(name: string) {
    return this.userRepository.find({ where: { name } });
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  update(id: string, user: UpdateUserDTO) {
    return this.userRepository.update(id, user);
  }

  delete(id: string) {
    return this.userRepository.delete(id);
  }

  saveUser(user: RegisterUserDTO) {
    const userEntity = this.userRepository.create(user);

    return this.userRepository.save(userEntity);
  }
}
