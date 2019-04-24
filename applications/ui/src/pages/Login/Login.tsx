import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import {Formik, Form, Field, FormikProps, FormikValues} from 'formik';
import * as Yup from 'yup';
import {AxiosError} from 'axios';
import {formikSubmitHandler} from '../../utils';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {authenticated as authenticatedAction} from '../../store/auth/auth.actions';
import {login} from '../../libs/auth';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {LinkButton} from '../../components/LinkButton';
import {TextField} from '../../components/TextField';
import {Grid} from '@material-ui/core';

import logo from '../../images/logo.png';

const styles = (theme: Theme) => ({
    card: {
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '500px',
        [theme.breakpoints.up('sm')]: {
            marginTop: '20vh'
        }
    },
    media: {
        height: 80,
        backgroundSize: 'auto 50px'
    },
    textField: {
        width: '100%'
    }
});

export interface ILoginComponentProps {
    classes: {
        card: string;
        media: string;
        textField: string;
    };
    authenticated(token: string, expiresAt: number, loadUserProperties?: boolean): void;
}

export interface ILoginComponentState {
    error: string | null;
}
interface ILoginFormValues {
    username: string;
    password: string;
}

class LoginComponent extends Component<ILoginComponentProps, ILoginComponentState> {
    state = {
        error: null
    };

    validationSchema = Yup.object().shape({
        username: Yup.string()
            .email('Invalid email address.')
            .required('Email address is required.'),
        password: Yup.string().required('Password is required.')
    });

    onSubmit = async (values: FormikValues) => {
        const {authenticated} = this.props;

        const {token, expiresAt} = await login(values.username, values.password);

        authenticated(token, expiresAt, true);
    };

    onSubmitFailedWithBadRequest = (error: AxiosError) => {
        if (error.response && error.response.data && error.response.data.message) {
            return this.setState({
                error: error.response.data.message
            });
        }
        return this.setState({
            error: 'Login failed. Please try again later or contact us.'
        });
    };

    renderForm = (props: FormikProps<ILoginFormValues>) => {
        const {classes} = this.props;
        const {error} = this.state;

        return (
            <Form>
                <Card className={classes.card}>
                    <CardMedia className={classes.media} image={logo} />
                    <CardHeader title="Login" titleTypographyProps={{align: 'center'}} />
                    <CardContent>
                        {error ? <Typography color="error">{error}</Typography> : null}
                        <Field name="username" label="Email" type="email" className={classes.textField} margin="normal" component={TextField} />
                        <Field name="password" label="Password" type="password" className={classes.textField} margin="normal" component={TextField} />
                    </CardContent>
                    <CardActions>
                        <Grid container direction="row-reverse" justify="space-between" alignItems="flex-end">
                            <Grid item>
                                <Button type="submit" variant="contained" color="primary" disabled={props.isSubmitting}>
                                    {props.isSubmitting ? 'sending...' : 'Login'}
                                </Button>
                            </Grid>
                            <Grid item>
                                <LinkButton color="primary" to="/forgot-password">
                                    Forgot password
                                </LinkButton>
                            </Grid>
                        </Grid>
                    </CardActions>
                </Card>
            </Form>
        );
    };

    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>Login</title>
                </Helmet>
                <Formik
                    initialValues={{username: '', password: ''}}
                    validationSchema={this.validationSchema}
                    onSubmit={formikSubmitHandler(this.onSubmit, {forbidden: this.onSubmitFailedWithBadRequest})}
                    render={this.renderForm}
                />
            </React.Fragment>
        );
    }
}

const StyledLoginComponent = withStyles(styles)(LoginComponent);

const mapDispatchToProps = (dispatch: Dispatch) => ({
    authenticated: (token: string, expiresAt: number, loadUserProperties?: boolean) => dispatch(authenticatedAction(token, expiresAt, loadUserProperties))
});

const Login = connect(
    null,
    mapDispatchToProps
)(StyledLoginComponent);

export {Login};
