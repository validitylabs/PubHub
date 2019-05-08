import React, {FunctionComponent} from 'react';
import {withStyles, createStyles, Grid} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import Paper from '@material-ui/core/Paper';
import PageTitle from '../../components/PageTitle';
import Typography from '@material-ui/core/Typography';
import {DatePicker} from '../../components/DatePicker';
import {SearchField} from './SearchField';
import {DisplayTable} from './DisplayTable';

const styles = (theme: Theme) =>
    createStyles({
        container: {
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '1vh'
        },
        paper: {
            padding: theme.spacing.unit * 2,
            textAlign: 'center',
            color: theme.palette.text.secondary,
            alignItems: 'center',
            paddingTop: theme.spacing.unit * 4
        },
        offset: {
            paddingLeft: '5%',
            marginTop: '1vh'
        },
        textField: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            width: '1.5vh'
        }
    });

export interface ISearchProps {
    classes: {
        container: string;
        paper: string;
        offset: string;
        textField: string;
    };
}

const SearchComponent: FunctionComponent<ISearchProps> = (props) => {
    const {classes} = props;

    return (
        <React.Fragment>
            <Grid container className={classes.container} direction="column" spacing={16}>
                <Grid item>
                    <PageTitle text="Search" />
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>
                        <SearchField />
                        <Grid container className={classes.offset} direction="row" spacing={16} alignItems="baseline">
                            <Typography paragraph={true} color="inherit">
                                only shown projects last modified from
                            </Typography>
                            <DatePicker label="from" defaultValue="2018-02-25" />
                            <Typography paragraph={true} color="inherit">
                                to
                            </Typography>
                            <DatePicker label="to" defaultValue="2019-02-25" />
                            <Typography paragraph color="inherit">
                                written by
                            </Typography>
                            <TextField
                                id="standard-with-placeholder"
                                // placeholder="Author"
                                label="author"
                                className={classes.textField}
                                margin="normal"
                            />
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item>
                    <DisplayTable />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

const styledSearchComponent = withStyles(styles)(SearchComponent);

export {styledSearchComponent as Search};
