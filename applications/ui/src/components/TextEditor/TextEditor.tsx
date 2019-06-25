import React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {store, RootState} from '../../store';
import {Formik, Form, Field, FormikProps, FormikValues} from 'formik';
import * as Yup from 'yup';
import {axios} from '../../axios';
import config from '../../config';
import {TextField} from '../../components/TextField';
import {withStyles, createStyles, Grid} from '@material-ui/core';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
// ---
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
// ---
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import {IContent} from '../../store/content/content.types';
import {IElasticreg} from '../../store/elasticreg/elasticreg.types';
import {initialContentState as defaultContentState} from '../../store/content/content.reducer';
import {
    readContentEditor as readContentEditorAction,
    cancelContentEditor as cancelContentEditorAction,
    saveContentEditor as saveContentEditorAction,
    writeContentEditor as writeContentEditorAction, // fallback of a failed tx
    showAlert as showAlertAction,
    hideAlert as hideAlertAction
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
    alertOn: boolean;
    modifiable: boolean;
    showInitial: boolean;
    lastUpdateTime: Date;
    content: IContent;
    displayEditor(): void;
    closeEditor(): void;
    saveEditor(newContentState: IContent): void;
    resumeEditor(newContentState: IContent): void;
    showContent(newContentState: IContent): void;
    displayAlert(): void;
    closeAlert(): void;
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
        const {saveEditor, closeEditor, resumeEditor, displayAlert, closeAlert} = this.props;
        displayAlert();
        console.log('before clicking save', store.getState());
        console.log('>>> onSubmit', values);
        saveEditor(values as any);
        console.log('after clicking save', store.getState());
        const ipfsDigest = await addToIpfs(values.title, values.text);
        console.log('>>> Got the digest ', ipfsDigest);
        // // if not axios method has been invoked,
        // // then only await for the response of the smart contract
        try {
            // Step 1: Write to smart contract and get the caller as the returned value.
            const account = await writeToSmartContract(ipfsDigest);
            console.log(` logging received account info ${account}`);
            closeAlert();
            if (account === '') {
                console.error(`>>> cannot proceed without smart contract registry.`);
                resumeEditor(values as any);
            } else {
                console.log('>>> Good');
                closeEditor();
                // Otherwise, invoke API call right afterwards.
                // The end point is https://localhost:3000/elastic/save
                // It saves the cretor address + ipfs digest + raw data to elastic search
                // A potential optimization: to parrallize the check:
                // 1. caller address and ipfs digest pair
                // 2. ipfs digest and {title, content} pair
                console.log(`>>> api query endpoint is ${config.APP_API_ENDPOINT}/elastic/save`);
                console.log(`>>> value to be saved TITLE ${values.title} CONTENT ${values.text} USER ${account} DIGEST ${ipfsDigest}`);
                try {
                    // Step 2: Verify with IPFS
                    // Step 3: Save to elastic
                    const response = await axios.post<IElasticreg>(
                        `${config.APP_API_ENDPOINT}/elastic/save`,
                        {
                            title: values.title,
                            content: values.text,
                            user: account,
                            digest: ipfsDigest
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8'
                                // Authorization: `Bearer ${authState.token}`
                            }
                        }
                    );
                    console.log('>>> submited!', response.data);
                } catch (error) {
                    console.log('>>> submit failed!', error);
                }
            }
        } catch (error) {
            console.error(`>>> Bad ${error}`);
        }
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

    handleReadOnlyOpen = (resultContentState: IContent) => {
        const {showContent} = this.props;
        console.log('added another functionality', store.getState());
        showContent(resultContentState);
    };

    renderForm = (props: FormikProps<IContent>) => {
        const {classes, modifiable, showInitial} = this.props;
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
                        {/* <Button type="submit" color="inherit" disabled={props.isSubmitting}>
                            {props.isSubmitting ? 'savinging...' : 'Save'}
                        </Button> */}
                        <Button type="submit" color="inherit" disabled={!modifiable}>
                            {showInitial ? (modifiable ? 'Save' : 'Savinging...') : 'Read only'}
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
        const {open, alertOn, closeAlert, showInitial, content} = this.props;
        return (
            <React.Fragment>
                <Dialog fullScreen open={open} onClose={this.handleClose} TransitionComponent={Transition}>
                    <Formik
                        enableReinitialize
                        initialValues={showInitial ? defaultContentState : content}
                        validationSchema={this.validationSchema}
                        onSubmit={this.onSubmit}
                        render={this.renderForm}
                    />
                </Dialog>
                <Dialog
                    open={alertOn}
                    onClose={closeAlert}
                    disableBackdropClick
                    disableEscapeKeyDown
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Please don't close the browser/window"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Please remain this browser tab open until your transaction is confirmed. Otherwise, there's risk of losing your entry. This step may
                            take up to 10 minutes.
                        </DialogContentText>
                        <Divider />
                        <DialogContentText id="alert-dialog-description">Step 1: Save content to IPFS (~instantly).</DialogContentText>
                        <DialogContentText id="alert-dialog-description">
                            Step 2: Write the digest to Ethereum network (Seconds to ~1 minute).
                        </DialogContentText>
                        <DialogContentText id="alert-dialog-description">
                            Step 3: Perform sanity check by pinning the content from IPFS network and compare the metadata with the data registered in the smart
                            contract (3~5 minutes).
                        </DialogContentText>
                        <DialogContentText id="alert-dialog-description">Step 4: Save the data to a centralized indexing service.</DialogContentText>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        );
    }
}

const styledTextEditorComponent = withStyles(styles)(TextEditorComponent);

const mapStateToProps = ({contentEditor, content}: RootState) => ({
    open: contentEditor.display,
    alertOn: contentEditor.alertOn,
    modifiable: contentEditor.modifiable,
    showInitial: contentEditor.showInitial,
    lastUpdateTime: contentEditor.content.updatedAt,
    initialContent: contentEditor.content,
    content
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    displayEditor: () => dispatch(writeContentEditorAction(defaultContentState)),
    closeEditor: () => dispatch(cancelContentEditorAction()),
    saveEditor: (newContentState: IContent) => dispatch(saveContentEditorAction(newContentState)),
    resumeEditor: (newContentState: IContent) => dispatch(writeContentEditorAction(newContentState)),
    showContent: (newContentState: IContent) => dispatch(readContentEditorAction(newContentState)),
    displayAlert: () => dispatch(showAlertAction()),
    closeAlert: () => dispatch(hideAlertAction())
});

const TextEditor = connect(
    mapStateToProps,
    mapDispatchToProps
)(styledTextEditorComponent);

export {TextEditor};
