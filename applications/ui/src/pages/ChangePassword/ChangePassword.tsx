import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import {Formik, Form, Field, FormikProps, FormikValues} from 'formik';
import {formikSubmitHandler, ConvertValidationErrorsFunction} from '../../utils';
import * as Yup from 'yup';
import {withRouter, RouteComponentProps} from 'react-router';
import config from '../../config';
import {axios} from '../../axios';
import * as queryString from 'query-string';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import {TextField} from '../../components/TextField';
import {Typography, Grid} from '@material-ui/core';
import {Link} from '../../components/Link';
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
    progressContainer: {
        display: 'flex',
        justifyContent: 'center'
    },
    progress: {
        margin: theme.spacing.unit * 4
    },
    textField: {
        width: '100%'
    }
});

export interface IChangePasswordComponentProps {
    classes: {
        card: string;
        media: string;
        progressContainer: string;
        progress: string;
        textField: string;
    };
}

export enum Status {
    ticketUnchecked,
    ticketValid,
    ticketInvalid,
    formSubmitted
}

export interface IChangePasswordComponentState {
    status: Status;
    error: string | null;
}

interface IChangePasswordFormValues {
    password: string;
    passwordConfirm: string;
}

class ChangePasswordComponent extends Component<IChangePasswordComponentProps & RouteComponentProps, IChangePasswordComponentState> {
    validationSchema = Yup.object().shape({
        password: Yup.string().required('Password is required'),
        passwordConfirm: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Password confirm is required')
    });

    state = {
        status: Status.ticketUnchecked,
        submitted: false,
        error: null
    };

    componentDidMount() {
        this.verifyInvitation().catch(() => {
            console.log('Failed validating invitation.');
        });
    }

    getTicketId(): string | null {
        const {id} = queryString.parse(this.props.location.search);

        if (typeof id === 'string') {
            return id;
        }

        return null;
    }

    async verifyInvitation() {
        const ticketId = this.getTicketId();

        if (!ticketId) {
            return this.setState({
                status: Status.ticketInvalid
            });
        }

        try {
            await axios.post(`${config.APP_API_ENDPOINT}/ui/user/validate-change-password-ticket`, {id: ticketId});

            return this.setState({
                status: Status.ticketValid
            });
        } catch (error) {
            if (error.response && error.response.status === 403) {
                return this.setState({
                    status: Status.ticketInvalid
                });
            }
            throw error;
        }
    }

    onSubmit = async (values: FormikValues) => {
        const ticketId = this.getTicketId();

        await axios.post(`${config.APP_API_ENDPOINT}/ui/user/change-password`, {ticketId, password: values.password});

        this.setState({
            status: Status.formSubmitted,
            error: null
        });
    };

    convertValidationErrors: ConvertValidationErrorsFunction<FormikValues> = (validationErrors) => {
        return validationErrors.reduce<any>((result, validationError) => {
            const constrainKeys = Object.keys(validationError.constraints);

            if (constrainKeys.length > 1) {
                result[validationError.property] = (
                    <React.Fragment>
                        Errors:
                        <br />
                        <ul>
                            {constrainKeys.map((constrainKey) => (
                                <li key={constrainKey}>{validationError.constraints[constrainKey]}.</li>
                            ))}
                        </ul>
                    </React.Fragment>
                );
            } else if (constrainKeys.length === 1) {
                result[validationError.property] = `${validationError.constraints[constrainKeys[0]]}.`;
            }

            return result;
        }, {});
    };

    onSubmitFailed = () => {
        this.setState({
            status: Status.formSubmitted
            //error: 'Failed to change password.'
        });
    };

    renderFormikForm = (props: FormikProps<IChangePasswordFormValues>) => {
        const {classes} = this.props;

        return (
            <Form>
                <CardContent>
                    <Typography>Please enter your new password.</Typography>
                    <Field name="password" label="Password" type="password" className={classes.textField} margin="normal" component={TextField} />
                    <Field
                        name="passwordConfirm"
                        label="Confirm password"
                        type="password"
                        className={classes.textField}
                        margin="normal"
                        component={TextField}
                    />
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

    renderForm() {
        return (
            <Formik
                initialValues={{password: '', passwordConfirm: ''}}
                validationSchema={this.validationSchema}
                onSubmit={formikSubmitHandler(this.onSubmit, {convertValidationErrors: this.convertValidationErrors, unknownError: this.onSubmitFailed})}
                render={this.renderFormikForm}
            />
        );
    }

    renderContent() {
        const {classes} = this.props;
        const {status, error} = this.state;

        if (status === Status.ticketUnchecked) {
            return (
                <CardContent>
                    <div className={classes.progressContainer}>
                        <CircularProgress className={classes.progress} />
                    </div>
                </CardContent>
            );
        }

        if (error) {
            return (
                <CardContent>
                    <Typography>Something went wrong. Please try again or contact us.</Typography>
                </CardContent>
            );
        }

        if (status === Status.ticketValid) {
            return this.renderForm();
        }

        if (status === Status.ticketInvalid) {
            return (
                <CardContent>
                    <Typography>Your password change link is invalid or expired.</Typography>
                </CardContent>
            );
        }

        if (status === Status.formSubmitted) {
            return (
                <CardContent>
                    <Typography>
                        The password of your account has been successfully changed. Click on the following link to login with your new credentials:{' '}
                        <Link variant="body2" to="/login">
                            Link
                        </Link>
                    </Typography>
                </CardContent>
            );
        }

        return (
            <CardContent>
                <CircularProgress className={classes.progress} />
            </CardContent>
        );
    }

    render() {
        const {classes} = this.props;

        return (
            <React.Fragment>
                <Helmet>
                    <title>Change password</title>
                </Helmet>

                <Card className={classes.card}>
                    <CardMedia className={classes.media} image={logo} />
                    <CardHeader title="Change password" titleTypographyProps={{align: 'center'}} />
                    {this.renderContent()}
                </Card>
            </React.Fragment>
        );
    }
}

const StyledChangePasswordComponent = withStyles(styles)(ChangePasswordComponent);

export const ChangePassword = withRouter(StyledChangePasswordComponent);
