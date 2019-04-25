import React from 'react';
import {Switch} from 'react-router';
import {AppRoute, AccessRestriction} from '../AppRoute';
// import {Login} from '../../pages/Login';
// import {ForgotPassword} from '../../pages/ForgotPassword';
// import {ChangePassword} from '../../pages/ChangePassword';
import {Home} from '../../pages/Home';
import {Search} from '../../pages/Search';
import {Projects} from '../../pages/Projects';
import {RelevantWorks} from '../../pages/RelevantWorks';

export const Routes = () => (
    <Switch>
        <AppRoute exact path="/" redirectTo="/home" />
        {/* <AppRoute exact path="/login" accessRestriction={AccessRestriction.public} accessRestrictionRedirect="/home" disableHeaderAndDrawer component={Login} />
        <AppRoute
            exact
            path="/forgot-password"
            accessRestriction={AccessRestriction.public}
            accessRestrictionRedirect="/home"
            disableHeaderAndDrawer
            component={ForgotPassword}
        />
        <AppRoute
            exact
            path="/change-password"
            accessRestriction={AccessRestriction.public}
            accessRestrictionRedirect="/home"
            disableHeaderAndDrawer
            component={ChangePassword}
        /> */}
        <AppRoute exact path="/home" accessRestriction={AccessRestriction.public} accessRestrictionRedirect="/login" component={Home} />
        <AppRoute exact path="/search" accessRestriction={AccessRestriction.public} accessRestrictionRedirect="/login" component={Search} />
        <AppRoute exact path="/projects" accessRestriction={AccessRestriction.public} accessRestrictionRedirect="/login" component={Projects} />
        <AppRoute exact path="/works" accessRestriction={AccessRestriction.public} accessRestrictionRedirect="/login" component={RelevantWorks} />
    </Switch>
);
