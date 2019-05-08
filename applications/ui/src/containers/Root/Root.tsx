import React, {Component} from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {initializeApplication as initializeApplicationAction} from '../../store/application/application.actions';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {ThemeOptions} from '@material-ui/core/styles/createMuiTheme';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';

const getMuiThemeOptions = (): ThemeOptions => {
    // Allow usage of breakpoints in create mui theme
    // tslint:disable-next-line:no-unused
    // createBreakpoints({});
    // eslint-disable-next-line
    const _breakpoints = createBreakpoints({});

    return {
        palette: {
            common: {black: '#000', white: '#fff'},
            background: {paper: '#fff', default: '#fafafa'},
            primary: {
                light: '#ffffff',
                main: '#ffffff',
                dark: '#e5e5e5',
                contrastText: '#000000'
            },
            secondary: {
                light: '#fffb50',
                main: '#fec800',
                dark: '#c69800',
                contrastText: '#333333'
            },
            error: {
                light: 'rgba(251, 106, 99, 1)',
                main: 'rgba(217, 50, 42, 1)',
                dark: 'rgba(163, 12, 6, 1)',
                contrastText: '#fff'
            },
            text: {
                primary: 'rgba(29, 28, 28, 1)',
                secondary: 'rgba(74, 74, 74, 1)',
                disabled: 'rgba(162, 162, 162, 1)',
                hint: 'rgba(97, 206, 252, 1)'
            }
        },
        overrides: {
            MuiFormControl: {
                root: {
                    margin: 0,
                    minWidth: 120,
                    width: '100%',
                    color: 'rgba(0, 24, 62, 1)'
                }
            },
            MuiCardActions: {
                root: {
                    padding: 16
                }
            },
            MuiDialogActions: {
                root: {
                    padding: 16
                }
            },
            MuiTypography: {
                h1: {
                    textTransform: 'uppercase',
                    fontSize: '2rem',
                    fontWeight: 400
                },
                h2: {
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    marginTop: '25px',
                    marginBottom: 0
                },
                h4: {
                    marginBottom: 0
                }
            },
            MuiLink: {
                root: {
                    color: '#1d8ee0'
                }
            },
            MuiButton: {
                textPrimary: {
                    color: '#1d8ee0'
                }
            }
        },
        typography: {
            useNextVariants: true
        }
    };
};

const theme = createMuiTheme(getMuiThemeOptions());

export interface IShellComponentProps {
    children: React.ReactNode;
}

interface IAuthCallbackDispatchProps {
    initializeApplication(): void;
}

export class RootComponent extends Component<IShellComponentProps & IAuthCallbackDispatchProps> {
    componentDidMount() {
        const {initializeApplication} = this.props;

        initializeApplication();
    }

    render() {
        const {children} = this.props;
        return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    initializeApplication: () => dispatch(initializeApplicationAction())
});

const Root = connect(
    null,
    mapDispatchToProps
)(RootComponent);

export {Root};
