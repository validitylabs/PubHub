import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as request from 'supertest';
import {Connection} from 'typeorm';
import {AppModule} from '../../app.module';
import * as moment from 'moment-timezone';

describe('StatusController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/status/ (GET)', async () => {
        return request(app.getHttpServer())
            .get('/status/')
            .expect(200)
            .then((response) => {
                const now = moment()
                    .tz('utc')
                    .unix();
                const oneMinuteAgo = moment()
                    .tz('utc')
                    .subtract(1, 'minutes')
                    .unix();
                expect(response.body.timestamp).toBeLessThanOrEqual(now);
                expect(response.body.timestamp).toBeGreaterThan(oneMinuteAgo);
            });
    });

    afterAll(async () => {
        const connection = app.get(Connection);
        await connection.close();
        await app.close();
    });
});
