export interface Connection {
  id: string;
  name: string;
  clientId: string;
  createdAt?: Date;
}

export interface CreateConnectionDTO {
  name: string;
  clientId: string;
}
