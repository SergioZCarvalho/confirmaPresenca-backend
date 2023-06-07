import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserToken } from 'src/user/entity/user-token';
import jwt from 'jsonwebtoken';

export const AuthUser = createParamDecorator((a, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const res = ctx.switchToHttp().getResponse();
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(403);
    res.send('User Unauthorized');
  } else {
    const user = jwt.decode(auth.split(' ')[1]);
    return user as UserToken;
  }
});
