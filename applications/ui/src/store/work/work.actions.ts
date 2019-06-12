import {action} from 'typesafe-actions';
// import {IWork, SearchActionTypes} from './work.types';
import {IReturnedWork, SearchActionTypes} from './work.types';

// export const getWorks = (works: IWork[]) =>
//     action(SearchActionTypes.SEARCH, {
//         works
//     });

export const getReturnedWorks = (works: IReturnedWork[]) =>
    action(SearchActionTypes.SEARCH, {
        works
    });
