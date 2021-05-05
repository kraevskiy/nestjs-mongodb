import { Module } from '@nestjs/common';
import { SitemapController } from './sitemap.controller';
import { TopPageModule } from '../top-page/top-page.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [SitemapController],
  imports: [TopPageModule, ConfigModule]
})
export class SitemapModule {

}
