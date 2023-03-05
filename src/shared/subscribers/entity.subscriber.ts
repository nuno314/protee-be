import { Injectable } from '@nestjs/common';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { SoftRemoveEvent } from 'typeorm/subscriber/event/SoftRemoveEvent';

@Injectable()
@EventSubscriber()
export class EntitySubscriber implements EntitySubscriberInterface {
    /**
     * Called before post insertion.
     */
    beforeInsert(event: InsertEvent<any>) {
        if (event.queryRunner.data['request']) {
            const req: any = event.queryRunner.data['request'];
            event.entity.createdBy = req.user?.id;
            event.entity.updatedBy = req.user?.id;
        }
    }

    /**
     * Called before entity update.
     */
    beforeUpdate(event: UpdateEvent<any>) {
        event.entity.updatedAt = new Date();

        if (event.queryRunner.data['request']) {
            const req: any = event.queryRunner.data['request'];
            event.entity.updatedBy = req.user?.id;
        }
    }

    /**
     * Called before entity removal.
     */
    beforeSoftRemove(event: SoftRemoveEvent<any>) {
        if (event.queryRunner.data['request']) {
            const req: any = event.queryRunner.data['request'];
            event.entity.deletedBy = req.user?.id;
        }
    }

    
}
