import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {Grid, createStyles, Theme, CircularProgress} from '@material-ui/core';

const styles = (theme: Theme) =>
    createStyles({
        progress: {
            marginRight: theme.spacing.unit * 2
        }
    });

class ActionPending extends Component<{classes: any; text: string}> {
    render() {
        const {classes, text} = this.props;

        return (
            <React.Fragment>
                <Grid container direction="row">
                    <CircularProgress size={22} className={classes.progress} />
                    <Typography variant="body1">{text}</Typography>
                </Grid>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(ActionPending);
