import * as jose from 'jose';
import { jwtPayload } from '../../types/jwtPayload';

export default async function validateJWT<T extends jwtPayload = jwtPayload>(
  jwt: string,
) {
  const secret = Buffer.from(process.env.SECRET!);

  const { payload } = await jose.jwtVerify(jwt, secret, {
    issuer: 'urn:tdh',
    audience: 'urn:tdh',
  });

  return payload as T;
}
