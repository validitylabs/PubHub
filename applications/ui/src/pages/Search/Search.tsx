import React, {FunctionComponent} from 'react';
import {withStyles, createStyles, Grid} from '@material-ui/core';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import Paper from '@material-ui/core/Paper';
import PageTitle from '../../components/PageTitle';
import {DatePicker} from '../../components/DatePicker';
import {SearchField} from './SearchField';
import {DisplayTable} from './DisplayTable';

const styles = (theme: Theme) =>
    createStyles({
        container: {
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: '900px',
            marginBottom: '1vh'
        },
        paper: {
            padding: theme.spacing.unit * 2,
            textAlign: 'center',
            color: theme.palette.text.secondary,
            alignItems: 'center'
        },
        offset: {
            paddingLeft: '5%',
            marginBottom: '1vh'
        }
    });

export interface ISearchProps {
    classes: {
        container: string;
        paper: string;
        offset: string;
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
                            only shown projects last modified from
                            <DatePicker label="from" defaultValue="2018-02-25" />
                            to
                            <DatePicker label="to" defaultValue="2019-02-25" />
                            written by (author)
                            {/* <Form>
                                <Field name="text" label="Comment" component={TextField} multiline />
                            </Form> */}
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
