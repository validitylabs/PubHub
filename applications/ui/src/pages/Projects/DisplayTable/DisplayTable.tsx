import React, {FunctionComponent} from 'react';
import {withStyles, createStyles, Grid} from '@material-ui/core';
import {SimpleTable} from '../../../components/SimpleTable';
import {IWork} from '../../../store/work/work.types';

const styles = () =>
    createStyles({
        container: {
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: '900px',
            marginBottom: '2vh'
        }
    });

export interface IDisplayTableProps {
    classes: {
        container: string;
    };
}

let id = 0;
function createData(title: string, author: string, year: number) {
    id += 1;
    return {id, title, author, year};
}

const inputRows: IWork[] = [
    createData('Temporal effects of ocean warming and acidification on coral–algal ...', 'Doe et al.', 2019),
    createData('Photochemical response of the scleractinian coral Stylophora ...', 'Doe et al.', 2018),
    createData('Resolving coral photoacclimation dynamics through coupled ...', 'Doe et al.', 2017)
];

const SampleDisplayTableComponent: FunctionComponent<IDisplayTableProps> = (props) => {
    const {classes} = props;
    return (
        <React.Fragment>
            <Grid container className={classes.container}>
                <SimpleTable rows={inputRows} />
            </Grid>
        </React.Fragment>
    );
};

const styledSampleDisplayTableComponent = withStyles(styles)(SampleDisplayTableComponent);

export {styledSampleDisplayTableComponent as DisplayTable};
