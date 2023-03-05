import { NestFactory } from '@nestjs/core';

import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
    await NestFactory.createApplicationContext(SeederModule)
        .then((appContext) => {
            const seeder = appContext.get(SeederService);
            seeder
                .seed()
                .then(() => {
                    // logger.debug('Seeding complete!');
                })
                .catch((error) => {
                    // logger.error('Seeding failed!');
                    throw error;
                })
                .finally(async () => {
                    console.log('CLOSE');
                    await appContext.close();
                });
        })
        .catch((error) => {
            throw error;
        });
}
bootstrap();
