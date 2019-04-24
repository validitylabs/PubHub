import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import {Formik, Form, Field, FormikProps, FormikValues, FormikActions} from 'formik';
import * as Yup from 'yup';
import {axios} from '../../axios';
import config from '../../config';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import {TextField} from '../../components/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import logo from '../../images/logo.png';

const styles = (theme: Theme) => ({
    media: {
        height: 80,
        backgroundSize: 'auto 50px'
    },
    card: {
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '500px',
        [theme.breakpoints.up('sm')]: {
            marginTop: '20vh'
        }
    },
    textField: {
        width: '100%'
    }
});

export interface IForgotPasswordComponentProps {
    classes: {
        media: string;
        card: string;
        textField: string;
    };
}

export interface IForgotPasswordComponentState {
    submitted: boolean;
    error: string | null;
}

interface IForgotPasswordFormValues {
    email: string;
}

class ForgotPasswordComponent extends Component<IForgotPasswordComponentProps, IForgotPasswordComponentState> {
    validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address.')
            .required('Email address is required.')
    });

    state = {
        submitted: false,
        error: null
    };

    onSubmit = async (values: FormikValues, formikActions: FormikActions<IForgotPasswordFormValues>) => {
        try {
            await axios.post(`${config.APP_API_ENDPOINT}/ui/user/change-password-request`, values);

            formikActions.setSubmitting(false);
            return this.setState({
                submitted: true,
                error: null
            });
        } catch (error) {
            console.log('Error', error);
            formikActions.setSubmitting(false);
            this.setState({
                submitted: false,
                error: 'Failed to create change password request.'
            });
        }
    };

    renderForm = (props: FormikProps<IForgotPasswordFormValues>) => {
        const {classes} = this.props;

        return (
            <Form>
                <CardContent>
                    <Typography>Enter your email address to initiate a password change request.</Typography>
                    <Field name="email" label="Email" type="email" className={classes.textField} margin="normal" component={TextField} />
                </CardContent>
                <CardActions>
                    <Grid container direction="row-reverse" justify="space-between" alignItems="flex-end">
                        <Grid item>
                            <Button type="submit" variant="contained" color="primary" disabled={props.isSubmitting}>
                                {props.isSubmitting ? 'sending...' : 'Submit'}
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Form>
        );
    };

    render() {
        const {classes} = this.props;
        const {submitted} = this.state;
        return (
            <React.Fragment>
                <Helmet>
                    <title>Forgot password</title>
                </Helmet>

                <Card className={classes.card}>
                    <CardMedia className={classes.media} image={logo} />
                    <CardHeader titleTypographyProps={{align: 'center'}} title="Forgot password" />
                    {submitted ? (
                        <CardContent>
                            <Typography paragraph>We've sent you an email. Click the link in the email to change your password.</Typography>
                            <Typography>
                                If you don't see the email, check other places it might be, like your junk, spam, social, or other folders. Otherwise the email
                                address wasn't correct.
                            </Typography>
                        </CardContent>
                    ) : (
                        <Formik
                            initialValues={{email: '', password: ''}}
                            validationSchema={this.validationSchema}
                            onSubmit={this.onSubmit}
                            render={this.renderForm}
                        />
                    )}
                </Card>
            </React.Fragment>
        );
    }
}

export const ForgotPassword = withStyles(styles)(ForgotPasswordComponent);
