import React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {store, RootState} from '../../store';
import TextField from '@material-ui/core/TextField';
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
import {readContentEditor as readContentEditorAction, cancelContentEditor as cancelContentEditorAction} from '../../store/content/content.actions';
// tslint:disable-next-line
const Ipfs = require('ipfs');

const styles = (theme: Theme) =>
    createStyles({
        appBar: {
            position: 'relative'
        },
        flex: {
            flex: 1
        },
        container: {
            marginLeft: '1%',
            marginRight: '1%',
            display: 'flex',
            flexWrap: 'wrap',
            width: '98%'
        },
        textField: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit
        }
    });

const defaultContentState: IContent = {
    id: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '',
    title: '',
    text: ''
};

interface IContentDisplayProps {
    open: boolean;
    lastUpdateTime: Date;
    displayEditor(): void;
    closeEditor(): void;
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

const node2 = new Ipfs({repo: 'ipfs-' + Math.random()});
node2.once('ready', () => {
    console.log('2 - Online status: ', node2.isOnline() ? 'online' : 'offline');
    //   document.getElementById("status").innerHTML= 'Node status: ' + (node.isOnline() ? 'online' : 'offline')
    //   // You can write more code here to use it. Use methods like
    //   // node.add, node.get. See the API docs here:
    //   // https://github.com/ipfs/interface-ipfs-core
});

class TextEditorComponent extends React.Component<ITextEditorComponentProps> {
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

    render() {
        const {classes, open} = this.props;
        return (
            <React.Fragment>
                <Dialog fullScreen open={open} onClose={this.handleClose} TransitionComponent={Transition}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                View/Edit file
                            </Typography>
                            <Button color="inherit" onClick={this.handleClose}>
                                save
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Grid container className={classes.container}>
                        <form className={classes.container} noValidate autoComplete="off">
                            <TextField
                                id="outlined-textarea"
                                label="Title"
                                placeholder="Please enter title here"
                                fullWidth
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                id="outlined-textarea"
                                label="Content"
                                placeholder="Please enter content here"
                                multiline
                                rows="25"
                                fullWidth
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                            />
                            <Grid item>Last updated at {this.props.lastUpdateTime.toLocaleString()}</Grid>
                        </form>
                    </Grid>
                </Dialog>
            </React.Fragment>
        );
    }
}

const styledTextEditorComponent = withStyles(styles)(TextEditorComponent);

const mapStateToProps = ({contentEditor}: RootState) => ({
    open: contentEditor.display,
    lastUpdateTime: contentEditor.content.updatedAt
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    displayEditor: () => dispatch(readContentEditorAction(defaultContentState)),
    closeEditor: () => dispatch(cancelContentEditorAction())
});

const TextEditor = connect(
    mapStateToProps,
    mapDispatchToProps
)(styledTextEditorComponent);

export {TextEditor};
