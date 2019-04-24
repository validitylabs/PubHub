import {Injectable} from '@nestjs/common';

export enum Status {
    ok
}

@Injectable()
export class StatusService {
    getStatus(): Status {
        return Status.ok;
    }
}
