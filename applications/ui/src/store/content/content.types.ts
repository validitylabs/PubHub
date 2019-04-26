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
    title: string;
    text: string;
}

export enum ContentDisplayActionTypes {
    READ_CONTENT = 'READ_CONTENT',
    WRITE_CONTENT = 'WRITE_CONTENT',
    CANCEL_CONTENT = 'CANCEL_CONTENT',
    SAVE_CONTENT = 'SAVE_CONTENT'
}

// export enum ContentModifyTypes {
//     MODIFIABLE_CONTENT = 'MODIFIABLE_CONTENT',
//     READONLY_CONTENT = 'READONLY_CONTENT'
// }

export interface IContentEditor {
    display: boolean;
    modifiable: boolean;
    content: IContent;
}

export type ContentEditorState = IContentEditor | null;
