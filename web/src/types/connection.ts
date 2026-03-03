export interface Connection {
  id: string;
  name: string;
  userId: string;
  createdAt?: Date;
}

export interface CreateConnectionDTO {
  name: string;
  userId: string;
}
