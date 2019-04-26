import React, {FunctionComponent} from 'react';
import {withStyles, createStyles, Grid} from '@material-ui/core';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import PageTitle from '../../components/PageTitle';
import {DisplayTable} from './DisplayTable';

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

export interface IProjectsProps {
    classes: {
        container: string;
        paper: string;
    };
}

const ProjectsComponent: FunctionComponent<IProjectsProps> = (props) => {
    const {classes} = props;

    return (
        <React.Fragment>
            <Grid container className={classes.container} direction="column" spacing={16}>
                <Grid item>
                    <PageTitle text="Own projects" />
                </Grid>
                <Grid item>This is the page that displays all the projects created by the current injected Ethereum address.</Grid>
                <Grid item>
                    <DisplayTable />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

const styledProjectsComponent = withStyles(styles)(ProjectsComponent);

export {styledProjectsComponent as Projects};
