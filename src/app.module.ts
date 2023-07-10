import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GreenBeanService } from './services/green-bean.service';
import { PrismaService } from './prisma.service';

const zodValidationProvider = {
  provide: APP_PIPE,
  useClass: ZodValidationPipe,
};

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [
    AppService,
    GreenBeanService,
    PrismaService,
    zodValidationProvider,
  ],
})
export class AppModule {}
