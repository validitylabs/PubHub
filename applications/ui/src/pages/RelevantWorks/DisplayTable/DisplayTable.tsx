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
    createData('Diversity in tropical rain forests and coral reefs', 'JH Connell', 1978),
    createData('Coral reefs under rapid climate change and ocean acidification', 'Hoegh-Guldberg et al.', 2007),
    createData('Climate change, human impacts, and the resilience of coral reefs', 'Hughes et al.', 2003),
    createData('Connectivity and management of Caribbean coral reefs', 'CM Roberts', 1997),
    createData('Thresholds and the resilience of Caribbean coral reefs', 'Mumby et al.', 2007)
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
