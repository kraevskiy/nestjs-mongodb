import { ITelegramOptions } from '../telegram/telegram.interface';
import { ConfigService } from '@nestjs/config';

export const getTelegramConfig = (configService: ConfigService): ITelegramOptions => {
  const token = configService.get('TLEGRAM_BOT_TOKEN')
  if (!token){
    throw new Error('TLEGRAM_BOT_TOKEN dont find')
  }
  console.log(configService);
  return {
    token: token,
    chatId: configService.get('TELEGRAM_CHAT_ID') ?? '',
  };
};
