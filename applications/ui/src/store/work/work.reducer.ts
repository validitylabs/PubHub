import {Reducer, AnyAction} from 'redux';
// import {IWork, SearchActionTypes, IWorksState} from './work.types';
import {IReturnedWork, SearchActionTypes, IReturnedWorksState} from './work.types';

export const initialWorkState: IReturnedWork = {
    title: 'Test title',
    content: 'Test content',
    user: 'OxVL',
    digest: 'Qm'
};

export const initialWorksState = [initialWorkState];

export const initialState: IReturnedWorksState = {
    isFetching: false,
    byId: {}
};

const isFetching = (state = false, action: AnyAction) => {
    switch (action.type) {
        case SearchActionTypes.SEARCH:
            return true;
        default:
            return state;
    }
};

const byId = (state = {}, action: AnyAction) => {
    switch (action.type) {
        case SearchActionTypes.SEARCH:
            return action.payload.works;
        default:
            return state;
    }
};

export const searchReducer: Reducer<IReturnedWorksState> = (state = initialState, action: AnyAction) => ({
    isFetching: isFetching(state.isFetching, action),
    // works: works(state, action)
    byId: byId(state.byId, action)
});
// export const initialWorkState: IWork = {
//     id: 0,
//     title: 'Test publication PubHub',
//     author: 'Validity Labs',
//     year: 2019
// };

// export const initialWorksState = [initialWorkState];

// export const initialState: IWorksState = {
//     isFetching: false,
//     byId: {}
// };

// const isFetching = (state = false, action: AnyAction) => {
//     switch (action.type) {
//         case SearchActionTypes.SEARCH:
//             return true;
//         default:
//             return state;
//     }
// };

// const byId = (state = {}, action: AnyAction) => {
//     switch (action.type) {
//         case SearchActionTypes.SEARCH:
//             return action.payload.works;
//         default:
//             return state;
//     }
// };

// export const searchReducer: Reducer<IWorksState> = (state = initialState, action: AnyAction) => ({
//     isFetching: isFetching(state.isFetching, action),
//     // works: works(state, action)
//     byId: byId(state.byId, action)
// });
