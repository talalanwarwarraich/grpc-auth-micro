import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '../auth.entity';
import { Repository } from 'typeorm';
import { JwtService as JWT } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class JwtService {
  @InjectRepository(Auth)
  private readonly repository: Repository<Auth>;

  constructor(private jwt: JWT) {}

  // decoding the jwt token
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token);
  }

  // get User by userId we get from decode()
  public async validateUser(decoded: any): Promise<Auth> {
    return this.repository.findOne(decoded.id);
  }

  public generateToken(auth: Auth): string {
    return this.jwt.sign({ id: auth.id, email: auth.email });
  }

  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  public async verify(token: string): Promise<any> {
    try {
      return this.jwt.verify(token);
    } catch (err) {}
  }
}
