import { Module, CacheModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';

@Module({
  imports: [NewsModule, CacheModule.register({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
