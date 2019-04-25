import React, {FunctionComponent} from 'react';
import InputBase from '@material-ui/core/InputBase';
import {fade} from '@material-ui/core/styles/colorManipulator';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import {withStyles, createStyles, Grid} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            width: '100%'
        },
        container: {
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: '800px',
            marginBottom: '1vh'
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.black, 0.15),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.black, 0.25)
            },
            marginLeft: 0,
            width: '200%'
        },
        searchIcon: {
            width: theme.spacing.unit * 9,
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        inputRoot: {
            color: 'inherit',
            width: '100%'
        },
        inputInput: {
            paddingTop: theme.spacing.unit,
            paddingRight: theme.spacing.unit,
            paddingBottom: theme.spacing.unit,
            paddingLeft: theme.spacing.unit * 10,
            transition: theme.transitions.create('width'),
            width: '100%'
        }
    });

export interface ISearchFieldProps {
    classes: {
        root: string;
        container: string;
        search: string;
        searchIcon: string;
        inputRoot: string;
        inputInput: string;
    };
}

const SearchFieldComponent: FunctionComponent<ISearchFieldProps> = (props) => {
    const {classes} = props;
    return (
        <React.Fragment>
            <Grid container className={classes.container}>
                <Grid container className={classes.search}>
                    <Grid item className={classes.searchIcon}>
                        <SearchIcon />
                    </Grid>
                    <InputBase
                        placeholder="Please enter keywords or title for searching…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput
                        }}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

const styledSearchFieldComponent = withStyles(styles)(SearchFieldComponent);

export {styledSearchFieldComponent as SearchField};
