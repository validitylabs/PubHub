import {Reducer, AnyAction} from 'redux';
import {IContent, IContentEditor, ContentActionTypes, AlertActionTypes} from './content.types';

export const initialContentState: IContent = {
    id: '0',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '',
    title: '',
    text: ''
};

const id = (state: string = initialContentState.id, action: AnyAction): string => {
    switch (action.type) {
        case ContentActionTypes.READ_CONTENT:
            return String(action.payload.content.id);
        case ContentActionTypes.SAVE_CONTENT:
            return String(parseInt(state, 10) + 1);
        default:
            return state;
    }
};

const createdAt = (state: Date = initialContentState.createdAt, action: AnyAction): Date => {
    switch (action.type) {
        case ContentActionTypes.READ_CONTENT:
            return action.payload.content.createdAt;
        default:
            return state;
    }
};

const updatedAt = (state: Date = initialContentState.createdAt, action: AnyAction): Date => {
    switch (action.type) {
        case ContentActionTypes.READ_CONTENT:
            return action.payload.content.updatedAt;
        case ContentActionTypes.SAVE_CONTENT:
            return new Date();
        default:
            return state;
    }
};

const userId = (state: string = initialContentState.userId, action: AnyAction): string => {
    switch (action.type) {
        case ContentActionTypes.READ_CONTENT:
            return action.payload.content.userId;
        default:
            return state;
    }
};

const title = (state = '', action: AnyAction): string => {
    switch (action.type) {
        case ContentActionTypes.READ_CONTENT:
            return action.payload.content.title;
        case ContentActionTypes.SAVE_CONTENT:
            return action.payload.content.title;
        default:
            return state;
    }
};

const text = (state = '', action: AnyAction): string => {
    switch (action.type) {
        case ContentActionTypes.READ_CONTENT:
            return action.payload.content.text;
        case ContentActionTypes.SAVE_CONTENT:
            return action.payload.content.text;
        default:
            return state;
    }
};

export const contentReducer: Reducer<IContent> = (state = initialContentState, action: AnyAction) => ({
    id: id(state.id, action),
    createdAt: createdAt(state.createdAt, action),
    updatedAt: updatedAt(state.updatedAt, action),
    userId: userId(state.userId, action),
    title: title(state.title, action),
    text: text(state.text, action)
});

const initialState: IContentEditor = {
    display: false,
    modifiable: false,
    showInitial: true,
    alertOn: false,
    content: initialContentState
};

const display = (state = false, action: AnyAction) => {
    switch (action.type) {
        case ContentActionTypes.READ_CONTENT:
            return true;
        case ContentActionTypes.WRITE_CONTENT:
            return true;
        case ContentActionTypes.CANCEL_CONTENT:
            return false;
        // case ContentActionTypes.SAVE_CONTENT:
        //     return false;
        default:
            return state;
    }
};

const showInitial = (state = true, action: AnyAction) => {
    switch (action.type) {
        case ContentActionTypes.SEARCH_CONTENT:
            return false;
        default:
            return state;
    }
};

const modifiable = (state = false, action: AnyAction) => {
    switch (action.type) {
        case ContentActionTypes.READ_CONTENT:
            return false;
        case ContentActionTypes.WRITE_CONTENT:
            return true;
        case ContentActionTypes.CANCEL_CONTENT:
            return false;
        case ContentActionTypes.SAVE_CONTENT:
            return false;
        default:
            return state;
    }
};

const content = (state: IContent = initialContentState, action: AnyAction) => {
    switch (action.type) {
        default:
            return state;
    }
};

const alertOn = (state = false, action: AnyAction) => {
    switch (action.type) {
        case AlertActionTypes.SHOW_ALERT:
            return true;
        case AlertActionTypes.HIDE_ALERT:
            return false;
        default:
            return state;
    }
};

export const contentEditorReducer: Reducer<IContentEditor> = (state = initialState, action: AnyAction) => ({
    display: display(state.display, action),
    modifiable: modifiable(state.modifiable, action),
    showInitial: showInitial(state.showInitial, action),
    alertOn: alertOn(state.alertOn, action),
    content: content(state.content, action)
});
