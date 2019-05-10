import React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {store, RootState} from '../../store';
import {Formik, Form, Field, FormikProps, FormikValues} from 'formik';
import * as Yup from 'yup';
import {TextField} from '../../components/TextField';
import {withStyles, createStyles, Grid} from '@material-ui/core';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import {IContent} from '../../store/content/content.types';
import {initialContentState as defaultContentState} from '../../store/content/content.reducer';
import {
    readContentEditor as readContentEditorAction,
    cancelContentEditor as cancelContentEditorAction,
    saveContentEditor as saveContentEditorAction
} from '../../store/content/content.actions';
import {initializeIpfs, addToIpfs} from '../../libs/ipfs';
import {writeToSmartContract} from '../../libs/web3';

const styles = (theme: Theme) =>
    createStyles({
        appBar: {
            position: 'relative'
        },
        flex: {
            flex: 1
        },
        container: {
            marginLeft: '2%',
            marginRight: '2.5%',
            display: 'flex',
            flexWrap: 'wrap',
            width: '95%'
        },
        textField: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit
        }
    });

interface IContentDisplayProps {
    open: boolean;
    lastUpdateTime: Date;
    content: IContent;
    displayEditor(): void;
    closeEditor(): void;
    saveEditor(newContentState: IContent): void;
}

export interface ITextEditorComponentProps extends IContentDisplayProps {
    classes: {
        appBar: string;
        flex: string;
        container: string;
        textField: string;
    };
}

const Transition = (props: any) => <Slide direction="up" {...props} />;

class TextEditorComponent extends React.Component<ITextEditorComponentProps> {
    validationSchema = Yup.object().shape({
        id: Yup.string(),
        createdAt: Yup.date(),
        updatedAt: Yup.date(),
        userId: Yup.string(),
        title: Yup.string().required('Title is required!'),
        text: Yup.string()
        // ,hash: Yup.string()
    });

    componentDidMount = () => {
        console.log(' [ proceed to initialize ipfs ] ');
        initializeIpfs();
    };

    onSubmit = async (values: FormikValues) => {
        const {saveEditor} = this.props;
        console.log('before save', store.getState());
        console.log('>>> onSubmit', values);
        saveEditor(values as any);
        console.log('after save', store.getState());
        const ipfsDigest = await addToIpfs(values.title, values.text);
        console.log('>>> Got the digest ', ipfsDigest);
        await writeToSmartContract(ipfsDigest);
    };

    handleClickOpen = () => {
        const {displayEditor} = this.props;
        console.log('when open', store.getState());
        displayEditor();
    };

    handleClose = () => {
        const {closeEditor} = this.props;
        console.log('when close', store.getState());
        closeEditor();
    };

    renderForm = (props: FormikProps<IContent>) => {
        const {classes} = this.props;
        return (
            <Form autoComplete="off">
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.flex}>
                            View and/or edit file
                        </Typography>
                        <Button type="submit" color="inherit" disabled={props.isSubmitting}>
                            {props.isSubmitting ? 'savinging...' : 'Save'}
                        </Button>
                    </Toolbar>
                </AppBar>
                <Grid container className={classes.container}>
                    <Field
                        name="title"
                        type="text"
                        label="Title"
                        placeholder="Please enter title here"
                        fullWidth
                        className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        component={TextField}
                    />
                    <Field
                        name="text"
                        type="text"
                        label="Content"
                        placeholder="Please enter content here"
                        multiline
                        rows="25"
                        fullWidth
                        className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        component={TextField}
                    />
                    <Grid item>
                        <Typography paragraph={true} color="inherit">
                            Last updated at {this.props.lastUpdateTime.toLocaleString()}
                        </Typography>
                    </Grid>
                </Grid>
            </Form>
        );
    };

    render() {
        const {open} = this.props;
        return (
            <React.Fragment>
                <Dialog fullScreen open={open} onClose={this.handleClose} TransitionComponent={Transition}>
                    <Formik
                        enableReinitialize
                        initialValues={defaultContentState}
                        validationSchema={this.validationSchema}
                        onSubmit={this.onSubmit}
                        render={this.renderForm}
                    />
                </Dialog>
            </React.Fragment>
        );
    }
}

const styledTextEditorComponent = withStyles(styles)(TextEditorComponent);

const mapStateToProps = ({contentEditor, content}: RootState) => ({
    open: contentEditor.display,
    lastUpdateTime: contentEditor.content.updatedAt,
    initialContent: contentEditor.content,
    content
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    displayEditor: () => dispatch(readContentEditorAction(defaultContentState)),
    closeEditor: () => dispatch(cancelContentEditorAction()),
    saveEditor: (newContentState: IContent) => dispatch(saveContentEditorAction(newContentState))
});

const TextEditor = connect(
    mapStateToProps,
    mapDispatchToProps
)(styledTextEditorComponent);

export {TextEditor};
