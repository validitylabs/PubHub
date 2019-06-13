import {Reducer, AnyAction} from 'redux';
// import {IWork, SearchActionTypes, IWorksState} from './work.types';
import {IReturnedWork, SearchActionTypes} from './work.types';
// import {IReturnedWork, SearchActionTypes, IReturnedWorksState} from './work.types';
import {IWork} from './work.types';

// export const initialWorkState: IReturnedWork = {
//     title: 'Test title',
//     content: 'Test content',
//     user: 'OxVL',
//     digest: 'Qm'
// };

// export const initialWorksState = [initialWorkState];

// export const initialState: IReturnedWorksState = {
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

// export const searchReducer: Reducer<IReturnedWorksState> = (state = initialState, action: AnyAction) => ({
//     isFetching: isFetching(state.isFetching, action),
//     // works: works(state, action)
//     byId: byId(state.byId, action)
// });

export const initialDisplayedWork: IWork[] = [
    {
        id: 1,
        title: 'Frozen The effect of UV radiation on photosynthetic production of the coral...',
        author: 'Buergel et al.',
        year: 2019
    },
    {
        id: 2,
        title: 'Predatory publishers are corrupting open access',
        author: 'J Beall',
        year: 2012
    },
    {
        id: 3,
        title: 'Symbiosis and UV radiation: a case study on negative growth rate ...',
        author: 'Mark et al',
        year: 1998
    },
];

export const displayReducer: Reducer<IWork[]> = (state = initialDisplayedWork, action: AnyAction) => {
    switch (action.type) {
        case SearchActionTypes.DISPLAY:
            // return action.payload.works;
            const display = action.payload.works.map((item: IReturnedWork, index: number) => {
                return {
                    id: index,
                    title: item.title,
                    author: item.user,
                    year: 2019
                };
            });
            return display;
        default:
            return state;
    }
};
