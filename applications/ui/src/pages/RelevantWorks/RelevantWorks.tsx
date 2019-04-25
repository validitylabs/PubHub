import React, {FunctionComponent} from 'react';
import {withStyles, createStyles, Grid} from '@material-ui/core';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import Paper from '@material-ui/core/Paper';
import PageTitle from '../../components/PageTitle';

const styles = (theme: Theme) =>
    createStyles({
        container: {
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: '800px',
            marginBottom: '5vh'
        },
        paper: {
            padding: theme.spacing.unit * 2,
            textAlign: 'center',
            color: theme.palette.text.secondary
        }
    });

export interface IRelevantWorksProps {
    classes: {
        container: string;
        paper: string;
    };
}

const RelevantWorksComponent: FunctionComponent<IRelevantWorksProps> = (props) => {
    const {classes} = props;

    return (
        <React.Fragment>
            <Grid container className={classes.container} direction="column" spacing={16}>
                <Grid item>
                    <PageTitle text="Relevant works" />
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>
                        This is the page that displays all the relevant works suggested by PubHub, based on user's existing projects.
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

const styledRelevantWorksComponent = withStyles(styles)(RelevantWorksComponent);

export {styledRelevantWorksComponent as RelevantWorks};
