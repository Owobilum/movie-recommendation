import { RequestHandler, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../../models/user.model';
import { asyncErrorHandler } from '../../utils/async-error-handler';
import { ACCESS_TOKEN_EXPIRES_IN } from '../../utils/constants';
import { CustomError } from '../../utils/custom-error';
import { dataSource } from '../../config/data-source';
import { IUser } from '../../types';

const handleLogin: RequestHandler = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new CustomError('Email and password are required.', 400));

    const foundUser = await dataSource.manager.findOneBy(User, { email });
    if (!foundUser || typeof foundUser.password !== 'string')
      return next(new CustomError('Invalid credentials', 401));

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid)
      return next(new CustomError('Invalid credentials', 401));

    const accessToken = jwt.sign(
      { user: foundUser.id },
      process.env.ACCESS_TOKEN_SECRET || '',
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    );

    const userObj: IUser = {
      id: foundUser.id,
      email: foundUser.email,
      username: foundUser.username,
    };

    res.status(200).json({
      message: 'Login successful!',
      data: { accessToken, user: userObj },
    });
  },
);

export { handleLogin };
