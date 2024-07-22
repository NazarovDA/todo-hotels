import * as jose from 'jose';
import { TokenData } from '../../types/tokenData';
import { env } from 'process';

export default async function generateToken(data: TokenData) {
  const secret = Buffer.from(env.SECRET ?? 'secret');
  const alg = 'HS256';
  const jwt = await new jose.SignJWT(data as any)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer('urn:tdh')
    .setAudience('urn:tdh')
    .setExpirationTime('12h')
    .sign(secret);

  return jwt;
}
