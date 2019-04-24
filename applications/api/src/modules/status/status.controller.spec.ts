import {Test, TestingModule} from '@nestjs/testing';
import {StatusController} from './status.controller';
import {StatusService} from './status.service';
import * as moment from 'moment-timezone';

describe('AppController', () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [StatusController],
            providers: [StatusService]
        }).compile();
    });

    describe('root', () => {
        it('should return the current timestamp', () => {
            const statusController = app.get<StatusController>(StatusController);
            const status = statusController.getStatus();
            const now = moment()
                .tz('utc')
                .unix();
            const fiveMinutesAgo = moment()
                .tz('utc')
                .subtract(1, 'minutes')
                .unix();

            expect(status.timestamp).toBeLessThanOrEqual(now);
            expect(status.timestamp).toBeGreaterThan(fiveMinutesAgo);
        });
    });
});
