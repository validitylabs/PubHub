import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as request from 'supertest';
import {Connection} from 'typeorm';
import {AppModule} from '../../../app.module';
import {UiUserService} from './ui-user.service';
import {IUiUserResponse} from './types/ui-user-response.interface';

describe('UiUserController (e2e)', () => {
    let app: INestApplication;
    const uiUserService = {
        getUser: (): IUiUserResponse => ({
            givenName: 'Max',
            familyName: 'Mustermann',
            email: 'max.mustermann@example.com'
        }),
        changePasswordRequest: () => '',
        validateChangePasswordTicket: () => '',
        changePassword: () => ''
    };

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule]
        })
            .overrideProvider(UiUserService)
            .useValue(uiUserService)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('/ (GET)', () => {
        it('should return status code 401 "Unauthorized"', async () => {
            return request(app.getHttpServer())
                .get('/ui/user/')
                .expect(401);
        });
    });

    it('/change-password-request (POST)', () => {
        return request(app.getHttpServer())
            .post('/ui/user/change-password-request/')
            .send({
                email: 'max.mustermann@example.com'
            })
            .set('Accept', 'application/json')
            .expect(201)
            .expect(uiUserService.changePasswordRequest());
    });

    it('/validate-change-password-ticket (POST)', () => {
        return request(app.getHttpServer())
            .post('/ui/user/validate-change-password-ticket/')
            .send({
                id: '12345'
            })
            .set('Accept', 'application/json')
            .expect(204)
            .expect(uiUserService.validateChangePasswordTicket());
    });

    it('/change-password (POST)', () => {
        return request(app.getHttpServer())
            .post('/ui/user/change-password/')
            .send({
                ticketId: '12345',
                password: 'Test1234'
            })
            .set('Accept', 'application/json')
            .expect(204)
            .expect(uiUserService.changePassword());
    });

    afterAll(async () => {
        const connection = app.get(Connection);
        await connection.close();
        await app.close();
    });
});
