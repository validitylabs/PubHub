import React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {RootState} from '../../store';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import {withStyles, createStyles} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {IWork, IReturnedWork} from '../../store/work/work.types';
// import {TextEditor} from '../../components/TextEditor';
import {IContent} from '../../store/content/content.types';
import {readContentEditor as readContentEditorAction, searchContentEditor as searchContentEditorAction} from '../../store/content/content.actions';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            marginTop: theme.spacing.unit * 3,
            overflowX: 'auto'
        },
        table: {
            minWidth: 700
        }
    });

export interface ISimpleTableProps {
    classes: {
        root: string;
        table: string;
    };
    rows: IWork[];
    searchResult: IReturnedWork[];
    showContent(newContentState: IContent): void;
    searchContent(): void;
}

class SimpleTableComponent extends React.Component<ISimpleTableProps> {
    handleOpen = (resultContentState: IReturnedWork) => {
        const {showContent, searchContent} = this.props;
        const transformToDisplay: IContent = {
            id: resultContentState.content,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: resultContentState.user,
            title: resultContentState.title,
            text: resultContentState.content
        };
        searchContent();
        showContent(transformToDisplay);
    };

    render() {
        const {classes, rows, searchResult} = this.props;
        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell align="center">Author</TableCell>
                            <TableCell align="left">Year</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.id} onClick={() => this.handleOpen(searchResult[index])}>
                                {/* onClick={() => console.log(`[In a table, clicking on the row]${JSON.stringify(searchResult[index])}`)} */}
                                <TableCell component="th" scope="row">
                                    {row.title}
                                </TableCell>
                                <TableCell align="center">{row.author}</TableCell>
                                <TableCell align="left">{row.year}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
};
const styledSimpleTableComponent = withStyles(styles)(SimpleTableComponent);

const mapStateToProps = ({searchResult}: RootState) => ({
    searchResult
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    showContent: (newContentState: IContent) => dispatch(readContentEditorAction(newContentState)),
    searchContent: () => dispatch(searchContentEditorAction())
});

const SimpleTable = connect(
    mapStateToProps,
    mapDispatchToProps
)(styledSimpleTableComponent);

export {SimpleTable};
