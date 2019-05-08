import React, {FunctionComponent} from 'react';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import {withStyles, createStyles} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

const styles = (theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap'
        },
        textField: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            width: '10%',
            minWidth: 150,
            maxWidth: 180
        }
    });

export interface IDatePickerProps {
    classes: {
        container: string;
        textField: string;
    };
    label: string;
    defaultValue: string;
}

const DatePickerComponent: FunctionComponent<IDatePickerProps> = (props) => {
    const {classes, label, defaultValue} = props;

    return (
        <form className={classes.container} noValidate>
            <TextField
                id="date"
                label={label}
                type="date"
                defaultValue={defaultValue}
                className={classes.textField}
                InputLabelProps={{
                    shrink: true
                }}
            />
        </form>
    );
};

const styledDatePickerComponent = withStyles(styles)(DatePickerComponent);

export {styledDatePickerComponent as DatePicker};
