// validation.middleware.ts
import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';

@Injectable()
export class ValidationMiddleware<C, U> implements NestMiddleware {
  constructor(
    private readonly createDto: C,
    private readonly updateDto: U,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    // Determine the DTO type dynamically based on some condition
    if (['GET', 'DELETE'].includes(req.method)) next();

    let specificDtoType: any;

    if (req.method === 'POST') {
      specificDtoType = this.createDto;
    } else {
      specificDtoType = this.updateDto;
    }

    // Instantiate the specific DTO type
    const specificDto = new specificDtoType();

    // Assign the data from the request body to the specific DTO
    Object.assign(specificDto, req.body);

    // Validate the specific DTO
    const errors = await validate(specificDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Attach the validated DTO to the request object for later use in the controller
    req['validatedDto'] = specificDto;

    next();
  }
}
