import {action} from 'typesafe-actions';
import {IContent, ContentActionTypes} from './content.types';

export const readContentEditor = (content: IContent) =>
    action(ContentActionTypes.READ_CONTENT, {
        content
    });

export const writeContentEditor = (content: IContent) =>
    action(ContentActionTypes.WRITE_CONTENT, {
        content
    });

export const cancelContentEditor = () => action(ContentActionTypes.CANCEL_CONTENT);

export const saveContentEditor = (content: IContent) =>
    action(ContentActionTypes.SAVE_CONTENT, {
        content
    });
