import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import {getHistory} from '../history';
// import {authReducer} from './auth/auth.reducer';
import {notificationReducer} from './notification/notification.reducer';
import {contentEditorReducer, contentReducer} from './content/content.reducer';
import {ethereumAccountReducer} from './ethereum/ethereum.reducer';
import {displayReducer} from './work/work.reducer';
// import {searchReducer, displayReducer} from './work/work.reducer';

export const rootReducer = combineReducers({
    router: connectRouter(getHistory()),
    // auth: authReducer,
    notification: notificationReducer,
    ethereumAccount: ethereumAccountReducer,
    contentEditor: contentEditorReducer,
    content: contentReducer,
    // search: searchReducer,
    displayTable: displayReducer
});
