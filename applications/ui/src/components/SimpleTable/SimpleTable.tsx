import React, {FunctionComponent} from 'react';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import {withStyles, createStyles} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {IWork} from '../../store/work/work.types';

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
}

const SimpleTableComponent: FunctionComponent<ISimpleTableProps> = (props) => {
    const {classes, rows} = props;

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
                    {rows.map((row) => (
                        <TableRow key={row.id}>
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

export {styledSimpleTableComponent as SimpleTable};
