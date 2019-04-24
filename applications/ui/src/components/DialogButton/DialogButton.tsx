import React, {FunctionComponent} from 'react';
import {withStyles, createStyles, Button, Theme} from '@material-ui/core';

const styles = (theme: Theme) =>
    createStyles({
        margin: {
            margin: theme.spacing.unit / 2
        }
    });

interface IDialogButtonProps {
    classes: any;
    text: string;
    containedButton?: boolean;
    submitType?: boolean;
    onClick?: any;
}

const DialogButton: FunctionComponent<IDialogButtonProps> = (props, rest) => (
    <React.Fragment>
        {props.submitType !== undefined ? (
            <Button fullWidth type="submit" color="default" variant="contained" className={props.classes.margin} {...rest}>
                {props.text}
            </Button>
        ) : (
            <Button
                fullWidth
                color={props.containedButton ? 'default' : 'primary'}
                variant={props.containedButton ? 'contained' : 'outlined'}
                onClick={props.onClick}
                className={props.classes.margin}
                {...rest}
            >
                {props.text}
            </Button>
        )}
    </React.Fragment>
);

export default withStyles(styles)(DialogButton);
