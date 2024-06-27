import { Service } from 'typedi';
import { Repository } from 'typeorm';

import { User } from '../models/user.model';
import { Profile } from '../models/profile.model';
import { hashPassword } from '../utils/encrypt';
import { checkIsInputValid } from '../utils/helpers';
import { dataSource } from '../config/data-source';
import { CustomError } from '../utils/custom-error';
import type { IUserRegisterResponse, IUser } from '../types';
import { Movie } from '../models/movie.model';

@Service()
export class UserService {
  private movieRepository: Repository<Movie>;
  private userRepository: Repository<User>;
  private profileRepository: Repository<Profile>;

  constructor() {
    this.movieRepository = dataSource.getRepository(Movie);
    this.userRepository = dataSource.getRepository(User);
    this.profileRepository = dataSource.getRepository(Profile);
  }

  async registerUser(
    email: string,
    password: string,
    username: string,
  ): Promise<IUserRegisterResponse> {
    if (!email || !password || !username) {
      throw new CustomError('Missing required field(s)', 400);
    }

    const hashedPassword = await hashPassword(password);

    const user = new User();
    user.email = email;
    user.password = hashedPassword;
    user.username = username;

    const isValid = await checkIsInputValid(user);
    if (!isValid) {
      throw new CustomError('Invalid user data', 400);
    }

    const profile = new Profile();
    const savedProfile = await this.profileRepository.save(profile);
    user.profile = savedProfile;
    const savedUser = await this.userRepository.save(user);

    return {
      email: savedUser.email,
      id: savedUser.id,
      username: savedUser.username,
    };
  }

  async getProfile(
    userId: number,
    authenticatedUserId?: string,
  ): Promise<IUser> {
    if (!authenticatedUserId)
      throw new CustomError('You cannot access this resource', 403);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'username'],
      relations: [
        'profile',
        'profile.watchlist',
        'profile.viewingHistory',
        'profile.favoriteCasts',
        'profile.favoriteDirectors',
        'profile.favoriteStudios',
        'profile.genres',
      ],
    });

    if (!user) throw new CustomError('User not found', 404);

    if (String(authenticatedUserId) !== String(userId))
      throw new CustomError('You cannot access this resource', 403);

    const userDto: IUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      watchlist: user.profile.watchlist,
      viewingHistory: user.profile.viewingHistory,
      preferences: {
        genres: user.profile.genres,
        favoriteCasts: user.profile.favoriteCasts,
        favoriteDirectors: user.profile.favoriteDirectors,
        favoriteStudios: user.profile.favoriteStudios,
      },
    };

    return userDto;
  }

  async updateWatchlist(
    userId: number,
    movieId?: string,
    authenticatedUserId?: string,
  ): Promise<Profile> {
    if (!movieId) throw new CustomError('No movie selected', 400);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile', 'profile.watchlist'],
    });

    if (!user) throw new CustomError('Cannot find user', 404);

    if (String(authenticatedUserId) !== String(userId))
      throw new CustomError('You cannot access this resource', 403);

    const profile = await this.profileRepository.findOne({
      where: { id: user.profile.id },
    });

    if (!profile) throw new CustomError('Cannot find profile', 404);

    const movie = await this.movieRepository.findOne({
      where: { id: parseInt(movieId) },
    });

    if (!movie) throw new CustomError('Movie does not exist', 404);

    profile.watchlist = [...user.profile.watchlist, movie];

    const savedProfile = await this.profileRepository.save(profile);

    return savedProfile;
  }
}
