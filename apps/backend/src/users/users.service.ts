import { Injectable } from '@nestjs/common';
import { users as rawUsers } from '../data/users';

// This should be a real class/interface representing a user entity
export type User = {
  businessName: string;
  name: string;
  id: string;
};

@Injectable()
export class UsersService {
  private readonly users = rawUsers.map((user) => ({
    businessName: user.business_name,
    name: user.founder_first_name + ' ' + user.founder_last_name,
    id: user.id,
  }));

  async findOneByName(name: string): Promise<User | undefined> {
    return Promise.resolve(
      this.users.find((user) => user.businessName === name),
    );
  }

  async findOneById(id: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((user) => user.id === id));
  }

  async getCompanies(): Promise<string[]> {
    return Promise.resolve(this.users.map((user) => user.businessName));
  }
}
