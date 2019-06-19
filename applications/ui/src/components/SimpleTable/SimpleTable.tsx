import React, {FunctionComponent} from 'react';
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
}

const SimpleTableComponent: FunctionComponent<ISimpleTableProps> = (props) => {
    const {classes, rows, searchResult} = props;

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
                        <TableRow key={row.id} onClick={() => console.log(`[In a table, clicking on the row]${JSON.stringify(searchResult[index])}`)}>
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
};
const styledSimpleTableComponent = withStyles(styles)(SimpleTableComponent);

const mapStateToProps = ({searchResult}: RootState) => ({
    searchResult
});

const mapDispatchToProps = () => ({});

const SimpleTable = connect(
    mapStateToProps,
    mapDispatchToProps
)(styledSimpleTableComponent);

export {SimpleTable};
