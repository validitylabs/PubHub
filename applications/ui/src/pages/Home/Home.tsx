import React, {FunctionComponent} from 'react';
import {withStyles, Grid} from '@material-ui/core';
import PageTitle from '../../components/PageTitle';

const styles = () => ({
    container: {
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '800px',
        marginBottom: '5vh'
    }
});

export interface IHomeProps {
    classes: {
        container: string;
    };
}

const HomeComponent: FunctionComponent<IHomeProps> = (props) => {
    const {classes} = props;

    return (
        <React.Fragment>
            <Grid container className={classes.container} direction="column" spacing={16}>
                <Grid item>
                    <PageTitle text="Home" />
                </Grid>
                <Grid item>Hello, World!</Grid>
            </Grid>
        </React.Fragment>
    );
};

const StyledHomeComponent = withStyles(styles)(HomeComponent);

export {StyledHomeComponent as Home};
