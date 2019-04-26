import {action} from 'typesafe-actions';
import {IContent, ContentDisplayActionTypes} from './content.types';

export const readContentEditor = (content: IContent) =>
    action(ContentDisplayActionTypes.READ_CONTENT, {
        content
    });

export const writeContentEditor = (content: IContent) =>
    action(ContentDisplayActionTypes.WRITE_CONTENT, {
        content
    });

export const cancelContentEditor = () => action(ContentDisplayActionTypes.CANCEL_CONTENT);

export const saveContentEditor = (content: IContent) =>
    action(ContentDisplayActionTypes.SAVE_CONTENT, {
        content
    });
