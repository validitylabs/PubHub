import React, {FunctionComponent} from 'react';
import {Typography} from '@material-ui/core';
import {withStyles, createStyles} from '@material-ui/core/styles';

const styles = () =>
    createStyles({
        container: {
            width: '220px !important'
        }
    });

interface IDialogLabelProps {
    classes: any;
    title: string;
    value: string;
}

const DialogLabel: FunctionComponent<IDialogLabelProps> = (props) => (
    <div className={props.classes.container}>
        <Typography variant="caption">{props.title}</Typography>
        <Typography variant="body1">{props.value}</Typography>
    </div>
);

export default withStyles(styles)(DialogLabel);
