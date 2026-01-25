import { Controller, Post } from '@nestjs/common';

@Controller('api/test')
export class TestController {
  @Post('public')
  public async test() {
    return { message: 'This endpoint is public' };
  }
}
