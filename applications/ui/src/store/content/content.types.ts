export enum ContentActionTypes {
    GET = '@@content/GET',
    GET_REQUEST = '@@content/GET_REQUEST',
    GET_RESPONSE = '@@content/GET_RESPONSE',
    GET_ERROR = '@@content/GET_ERROR'
}

export interface IContent {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    text: string;
}
