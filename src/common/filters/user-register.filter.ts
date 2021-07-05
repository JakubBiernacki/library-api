import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(ConflictException)
export class UserRegisterFilter<T extends HttpException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    const fields: Record<string, string> = {};

    const { username, email } = <any>exception.getResponse();

    if (username) {
      fields.username = `User with username: ${username} already exist`;
    }
    if (email) {
      fields.email = `User with email: ${email} already exist`;
    }

    response.status(statusCode).json({
      statusCode,
      fields,
      error: 'Conflict',
    });
  }
}
