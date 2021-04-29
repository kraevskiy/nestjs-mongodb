import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes, ValidationPipe,
} from '@nestjs/common';
import { TopPageModel } from './top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { PAGE_NOT_FOUND_ERROR } from './top-page.constans';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {
  }

  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const findPage = await this.topPageService.findById(id);
    if (!findPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }
    return findPage;
  }

  @Get('/byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const findPageAlias = await this.topPageService.findByAlias(alias);
    if (!findPageAlias) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }
    return findPageAlias;
  }

  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedPage = this.topPageService.deleteById(id);
    if (!deletedPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }
  }

  @Patch(':id')
  async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateTopPageDto) {
    const updatedPage = this.topPageService.updateById(id, dto);
    if (!updatedPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }
    return updatedPage;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto.firstCategory)
  }
}
