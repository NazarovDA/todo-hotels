/* eslint-disable prettier/prettier */

export type CreateUserAns = {
  ok: false;
} | {
  ok: true;
  id: string;
}

export type GetIdAns = {
  ok: false;
} | {
  ok: true;
  jwt: string;
}
