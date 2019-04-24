import {Entity, Unique, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import {IUserResponse} from './types/user-response.interface';

// @see https://schema.org/Person

@Entity()
@Unique(['username', 'email'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    username: string;

    @Column({length: 100, nullable: true})
    passwordHash: string | undefined;

    @Column({nullable: true})
    passwordUpdatedAt: Date;

    @Column({default: false})
    active: boolean;

    @Column({nullable: true, default: null})
    email: string;

    @Column({default: false})
    emailVerified: boolean;

    @Column({default: true})
    verifyEmail: boolean;

    @Column({length: 500, nullable: true, default: null})
    givenName: string;

    @Column({length: 500, nullable: true, default: null})
    familyName: string;

    getResponse(): IUserResponse {
        return {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            username: this.username,
            passwordUpdatedAt: this.passwordUpdatedAt,
            active: this.active,
            email: this.email,
            emailVerified: this.emailVerified,
            verifyEmail: this.verifyEmail,
            givenName: this.givenName,
            familyName: this.familyName
        };
    }
}
