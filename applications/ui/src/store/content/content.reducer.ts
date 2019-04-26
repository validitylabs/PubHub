import {Reducer, AnyAction} from 'redux';
import {IContent, IContentEditor, ContentDisplayActionTypes} from './content.types';

const initialContentState: IContent = {
    id: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '',
    title: '',
    text: ''
};

const initialState: IContentEditor = {
    display: false,
    modifiable: false,
    content: initialContentState
};

const display = (state = false, action: AnyAction) => {
    switch (action.type) {
        case ContentDisplayActionTypes.READ_CONTENT:
            return true;
        case ContentDisplayActionTypes.WRITE_CONTENT:
            return true;
        case ContentDisplayActionTypes.CANCEL_CONTENT:
            return false;
        case ContentDisplayActionTypes.SAVE_CONTENT:
            return false;
        default:
            return state;
    }
};

const modifiable = (state = false, action: AnyAction) => {
    switch (action.type) {
        case ContentDisplayActionTypes.READ_CONTENT:
            return false;
        case ContentDisplayActionTypes.WRITE_CONTENT:
            return true;
        case ContentDisplayActionTypes.CANCEL_CONTENT:
            return false;
        case ContentDisplayActionTypes.SAVE_CONTENT:
            return false;
        default:
            return state;
    }
};

const content = (state = initialContentState, action: AnyAction) => {
    switch (action.type) {
        case ContentDisplayActionTypes.READ_CONTENT:
            return state;
        case ContentDisplayActionTypes.WRITE_CONTENT:
            return action.payload.comments;
        case ContentDisplayActionTypes.CANCEL_CONTENT:
            return state;
        case ContentDisplayActionTypes.SAVE_CONTENT:
            return action.payload.comments;
        default:
            return state;
    }
};

export const contentEditorReducer: Reducer<IContentEditor> = (state = initialState, action: AnyAction) => ({
    display: display(state.display, action),
    modifiable: modifiable(state.modifiable, action),
    content: content(state.content, action)
});
