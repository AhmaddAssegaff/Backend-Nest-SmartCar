export interface JwtPayloadS {
  username: string;
  sub: string;
  role: string;
}

export interface JwtPayloadC {
  id: string;
  username: string;
  role: string;
}

export interface Users {
  username: string;
}
