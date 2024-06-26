import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';

import { AuthService } from '../services/auth.service';
import { asyncErrorHandler } from '../utils/async-error-handler';

@Service()
export class AuthController {
  constructor(@Inject() private readonly authService: AuthService) {}

  login = asyncErrorHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const loginResponse = await this.authService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'login successful',
      data: loginResponse,
    });
  });
}
