import { Service } from 'typedi';
import { Repository } from 'typeorm';

import { CustomError } from '../utils/custom-error';
import { User } from '../models/user.model';
import { dataSource } from '../config/data-source';
import { checkIsPasswordValid, generateJWT } from '../utils/helpers';
import { IUserRegisterResponse } from '../types';

interface IAuthResponse {
  accessToken: string;
  user: IUserRegisterResponse;
}

@Service()
export class AuthService {
  userRepository: Repository<User>;

  constructor() {
    this.userRepository = dataSource.getRepository(User);
  }

  async login(email: string, password: string): Promise<IAuthResponse> {
    if (!email || !password)
      throw new CustomError('Email and password are required.', 400);

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new CustomError('Invalid credentials', 401);

    const isPasswordValid = await checkIsPasswordValid(password, user.password);
    if (!isPasswordValid) throw new CustomError('Invalid credentials', 401);

    const accessToken = generateJWT({ user: user.id });

    const userResponseDto: IUserRegisterResponse = {
      email: user.email,
      id: user.id,
      username: user.username,
    };

    return { accessToken, user: userResponseDto };
  }
}
