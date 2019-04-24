import {Controller, Get, HttpException, HttpStatus} from '@nestjs/common';
import {StatusService, Status} from './status.service';
import * as moment from 'moment-timezone';

interface IStatusResponse {
    timestamp: number;
}

@Controller('status')
export class StatusController {
    constructor(private readonly statusService: StatusService) {}

    @Get()
    getStatus(): IStatusResponse {
        const status = this.statusService.getStatus();

        if (status === Status.ok) {
            return {
                timestamp: moment.tz('utc').unix()
            };
        }

        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
