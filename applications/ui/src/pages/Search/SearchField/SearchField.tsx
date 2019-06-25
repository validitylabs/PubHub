import React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import InputBase from '@material-ui/core/InputBase';
import {fade} from '@material-ui/core/styles/colorManipulator';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import {withStyles, createStyles, Grid} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
// import {client} from '../../../elastic';
import {axios} from '../../../axios';
import config from '../../../config';
import {updateDisplayedWorks as updateDisplayedWorksAction, getReturnedWorks as getReturnedWorksAction} from '../../../store/work/work.actions';
import {IReturnedWork} from '../../../store/work/work.types';

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
    updateTable(works: IReturnedWork[]): void;
    updateResult(works: IReturnedWork[]): void;
}

class SearchFieldComponent extends React.Component<ISearchFieldProps> {
    handleRequestSearch = async (e: any) => {
        const {updateTable, updateResult} = this.props;

        if (e.charCode === 13 || e.key === 'Enter') {
            // write your functionality here
            console.log('searching for:', e.target.value);
            try {
                const response = await axios.get<any>(`${config.APP_API_ENDPOINT}/elastic/search?q=${e.target.value}`, {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                        // Authorization: `Bearer ${authState.token}`
                    }
                });
                const results = response.data[0].hits.hits.map((item: any) => {
                    return item._source;
                });
                // update the result saved in the browser
                updateResult(results);
                // update the displayed table
                updateTable(results);
            } catch (error) {
                console.log('>>> submit failed!', error);
            }
        }
    };

    render() {
        const {classes} = this.props;
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
                            onKeyPress={this.handleRequestSearch}
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

const styledSearchFieldComponent = withStyles(styles)(SearchFieldComponent);

const mapStateToProps = () => ({
    // displayTable
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    updateTable: (works: IReturnedWork[]) => dispatch(updateDisplayedWorksAction(works)),
    updateResult: (works: IReturnedWork[]) => dispatch(getReturnedWorksAction(works))
});

const SearchField = connect(
    mapStateToProps,
    mapDispatchToProps
)(styledSearchFieldComponent);

export {SearchField};
