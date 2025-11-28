import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { HttpModule } from './http/http.module';
import { SchedulerInitService } from './scheduler/scheduler-init.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    HttpModule,
  ],
  providers: [SchedulerInitService],
})
export class AppModule {}
