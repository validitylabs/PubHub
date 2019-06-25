export enum ContentFetchActionTypes {
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

export enum ContentActionTypes {
    READ_CONTENT = 'READ_CONTENT',
    WRITE_CONTENT = 'WRITE_CONTENT',
    CANCEL_CONTENT = 'CANCEL_CONTENT',
    SAVE_CONTENT = 'SAVE_CONTENT',
    SEARCH_CONTENT = 'SEARCH_CONTENT'
}

export enum AlertActionTypes {
    SHOW_ALERT = 'SHOW_ALERT',
    HIDE_ALERT = 'HIDE_ALERT'
}

// export enum ContentModifyTypes {
//     MODIFIABLE_CONTENT = 'MODIFIABLE_CONTENT',
//     READONLY_CONTENT = 'READONLY_CONTENT'
// }

export interface IContentEditor {
    display: boolean;
    modifiable: boolean;
    showInitial: boolean;
    alertOn: boolean;
    content: IContent;
}

export type ContentEditorState = IContentEditor | null;
