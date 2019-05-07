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
// tslint:disable-next-line
const Ipfs = require('ipfs');

const options = {
    repo: 'ipfs-' + String(Math.random() + Date.now()),
    config: {
        Addresses: {
            API: '/ip4/127.0.0.1/tcp/5001',
            //API: '/ip4/127.0.0.1/tcp/5002'
            Gateway: '/ip4/127.0.0.1/tcp/8080'
        },
        API: {
            HTTPHeaders: {
                'Access-Control-Allow-Methods': ['PUT', 'GET', 'POST'],
                'Access-Control-Allow-Origin': ['http://127.0.0.1:5001', 'https://webui.ipfs.io']
            }
        }
    }
};
const node = new Ipfs(options);

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

const addToIpfs = async (title: String, text: String) => {
    const textToBeAdded = `Going to add title ${title} and text ${text}`;
    console.log(textToBeAdded);
    const files = [
        {
            path: '/tmp/myfile.txt',
            content: Ipfs.Buffer.from(textToBeAdded)
        }
    ];

    const filesAdded = await node.add(files);

    // , (error: any, result: any) => {
    //     if (error || !result) {
    //         console.log(error);
    //     } else {
    //         console.log('Success! and the result is ', result);
    //     }
    //     node.id((err: any, res: any) => {
    //         if (err) {
    //             throw err;
    //         }
    //         console.log('[When adding file] BTW, the node identity is: ', res);
    //     });
    // }

    // Add another one
    // const filesAdded = await node.add({
    //     path: 'hello.txt',
    //     content: Buffer.from('Hello World 101')
    // });
    console.log('Added file:', filesAdded);

    // try to retrieve both hashes now
    const fileBuffer = await node.cat(filesAdded[1].hash); //filesAdded[0].hash
    console.log('[ ipfs retrieve ] Added file contents:', fileBuffer.toString());
    const directoryFile = await filesAdded.find((f: any) => f.path === 'tmp');
    const directoryBuffer = await node.cat(`/ipfs/${directoryFile.hash}/myfile.txt`);
    console.log('[ ipfs retrieve ] Added file contents:', directoryBuffer.toString());
};

const initializeIpfs = () => {
    console.log(' [ initialize ipfs ] Online status: ', node.isOnline() ? 'online' : 'offline');
    node.once('ready', () => {
        console.log(' [ initialize ipfs ] IPFS node is ready');
        node.swarm.connect(
            '/ip4/127.0.0.1/tcp/4003/ws/ipfs/QmVJQDXoLqfBpBwBVmi96zbuD3eQazQf274EEwLB6BNWaZ',
            // This information is in align with the daemon. Connecting through websocket by the hash. Config could be found and set at "~/.ipfs/config"
            (err: any) => {
                if (err) {
                    throw err;
                }
                // if no err is present, connection is now open
                console.log(' [ initialize ipfs ] Websocket connection is added');
                node.id((err: any, res: any) => {
                    if (err) {
                        throw err;
                    }
                    console.log(' [ initialize ipfs ]  The node identity is: ', res);
                    node.config.get((err: any, config: any) => {
                        if (err) {
                            throw err;
                        }
                        console.log(' [ initialize ipfs ] The node config is: ', config);
                    });
                });
            }
        );
    });
    node.once('error', (error: any) => {
        console.error('Something went terribly wrong!', error);
    });
    node.once('start', () => console.log('Node started!'));
};

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
        console.log('componentDidMount');
        initializeIpfs();
    };

    onSubmit = async (values: FormikValues) => {
        const {saveEditor} = this.props;
        console.log('before save', store.getState());
        console.log('>>> onSubmit', values);
        saveEditor(values as any);
        console.log('after save', store.getState());
        await addToIpfs(values.title, values.text);
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
                    {/* <Field
                        name="hash"
                        type="text"
                        label="Hash"
                        placeholder="Please enter the to-be-retrieved hash"
                        fullWidth
                        className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        component={TextField}
                    /> */}
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
