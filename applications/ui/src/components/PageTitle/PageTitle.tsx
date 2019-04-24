import React, {FunctionComponent} from 'react';
import {Typography, withStyles, createStyles} from '@material-ui/core';

const styles = () =>
    createStyles({
        pageTitle: {
            fontWeight: 'bold',
            marginTop: 8,
            marginBottom: 20
        }
    });

interface IPageTitleProps {
    classes: any;
    text: string;
}

const PageTitle: FunctionComponent<IPageTitleProps> = (props, rest) => (
    <Typography className={props.classes.pageTitle} variant="h4" {...rest}>
        {props.text}
    </Typography>
);

export default withStyles(styles)(PageTitle);
