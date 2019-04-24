import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';
import * as moment from 'moment-timezone';

@Entity()
export class UserChangePasswordTicket {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdDate: Date;

    @Column()
    userId: string;

    isValid(): boolean {
        const tenDaysAgo = moment()
            .tz('utc')
            .subtract(10, 'days')
            .unix();
        return Boolean(
            moment(this.createdDate)
                .tz('utc')
                .unix() >= tenDaysAgo
        );
    }
}
