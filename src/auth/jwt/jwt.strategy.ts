import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'una_clave_ultra_secreta_123@',
    });    
  }

  async validate(payload: any) {
    // Aquí puedo añadir lógica adicional si quieres
    return { userId: payload.sub, email: payload.email };
  }
}
