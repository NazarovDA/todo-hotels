import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtAuthGuard {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.header('Authorization').replace('Bearer ', '');
      if (!token) {
        return false;
      }
      request.user = await this.authService.getUser(token);
      return true;
    } catch (e) {
      return false;
    }
  }
}
