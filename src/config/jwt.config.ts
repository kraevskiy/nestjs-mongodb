import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';

export const getJWTConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => {
  return {
    secret: configService.get('JWT_SECRET'),
  };
};
