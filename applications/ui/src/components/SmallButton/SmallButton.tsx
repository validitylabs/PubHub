import React, {FunctionComponent} from 'react';
import {Button, withStyles, createStyles} from '@material-ui/core';
import classNames from 'classnames';

const styles = () =>
    createStyles({
        smallButton: {
            marginBottom: 8
        }
    });

interface ISmallButtonProps {
    classes: any;
    text: string;
    style?: React.CSSProperties;
    onClick?: any;
    className?: any;
}

const SmallButton: FunctionComponent<ISmallButtonProps> = (props, rest) => (
    <Button
        className={classNames(props.classes.smallButton, props.className)}
        style={props.style}
        variant="outlined"
        size="small"
        onClick={props.onClick}
        {...rest}
    >
        {props.text}
    </Button>
);

export default withStyles(styles)(SmallButton);
