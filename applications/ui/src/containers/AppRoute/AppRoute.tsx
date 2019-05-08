// tslint:disable:jsx-no-lambda react-this-binding-issue
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Route, Redirect, RouteComponentProps} from 'react-router';
import {LocationDescriptor} from 'history';
import {Shell} from '../Shell';
import {RootState} from '../../store';
// import {IAuthState} from '../../store/auth/auth.types';

export enum AccessRestriction {
    private,
    public
}

interface IAppRouteComponentStateProps {
    // auth: IAuthState;
}

interface IAppRouteComponentProps {
    /**
     * A React component to render only when the location matches
     * Warning: <AppRoute component> takes precedence over <AppRoute redirect> so don’t use both in the same <AppRoute>.
     */
    component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any> | null;

    /**
     * Redirect target of the route
     * Warning: <AppRoute component> takes precedence over <AppRoute redirect> so don’t use both in the same <AppRoute>.
     */
    redirectTo?: LocationDescriptor | null;

    accessRestriction?: AccessRestriction | null;
    accessRestrictionRedirect?: LocationDescriptor | null;
    disableHeaderAndDrawer?: boolean;
    disableNavigation?: boolean;

    path?: string | string[];
    exact?: boolean;
    sensitive?: boolean;
    strict?: boolean;
}

class AppRouteComponent extends Component<IAppRouteComponentProps & IAppRouteComponentStateProps & RouteComponentProps<any>> {
    static defaultProps = {
        component: null,
        redirectTo: null,
        accessRestriction: null,
        accessRestrictionRedirect: null,
        disableHeaderAndDrawer: false,
        disableNavigation: false
    };

    render() {
        const {redirectTo, component, disableHeaderAndDrawer, disableNavigation, ...rest} = this.props;

        // tslint:disable-next-line no-shadowed-variable
        const ComponentToRender = component;

        return (
            <Route
                {...rest}
                render={(props) => {
                    if (ComponentToRender) {
                        return (
                            <Shell enableHeaderAndDrawer={!disableHeaderAndDrawer} disableNavigation={disableNavigation}>
                                <ComponentToRender {...props} />
                            </Shell>
                        );
                    }

                    if (redirectTo) {
                        return <Redirect to={redirectTo} />;
                    }

                    return null;
                }}
            />
        );
    }
}

// eslint-disable-next-line
const mapStateToProps = ({}: RootState) => ({
    // auth
});

export const AppRoute = withRouter(connect(mapStateToProps)(AppRouteComponent));
