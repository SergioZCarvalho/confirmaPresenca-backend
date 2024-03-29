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

  getByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  getAll() {
    return this.userRepository.find();
  }

  async getUserById(id: string) {
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

  async updateCodeAndCodeExp(email: string, code: string, codeExp: Date) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    user.code = code;
    user.codeExp = codeExp;

    return this.userRepository.save(user);
  }

  async updatePassword(user: User) {
    return this.userRepository.save(user);
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
