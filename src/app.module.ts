import './boilerplate.polyfill';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
const modules = [SharedModule];
@Module({
    imports: [...modules],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
