import type { RequestHandler } from 'express';

import { User } from '../../models/user.model';
import { asyncErrorHandler } from '../../utils/async-error-handler';
import { CustomError } from '../../utils/custom-error';
import { hashPassword } from '../../utils/encrypt';
import type { IUser } from '../../types';
import { checkIsInputValid } from '../../utils/helpers';

const handleRegisterUser: RequestHandler = asyncErrorHandler(
  async (req, res, next) => {
    const { email, password, username } = req.body;
    if (!email || !password || !username)
      return next(new CustomError('Missing required field(s)', 400));

    const hashedPassword = await hashPassword(password);

    const user = new User();

    user.email = email;
    user.password = hashedPassword;
    user.username = username;

    const isValid = await checkIsInputValid(user);

    if (!isValid) return;

    const savedUser = await user.save();

    const userObj: IUser = {
      email: savedUser.email,
      id: savedUser.id,
      username: savedUser.username,
    };

    res.status(201).json({
      status: 'success',
      message: 'New user created!',
      data: userObj,
    });
  },
);

export { handleRegisterUser };
