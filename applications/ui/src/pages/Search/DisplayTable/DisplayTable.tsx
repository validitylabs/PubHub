import React, {FunctionComponent} from 'react';
import {withStyles, createStyles, Grid} from '@material-ui/core';
import {SimpleTable, IWork} from '../../../components/SimpleTable';

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
    createData('Frozen The effect of UV radiation on photosynthetic production of the coral ...', 'Buergel et al.', 2019),
    createData('A casual relationship between UV radiation and coral bleaching in ...', 'Willy et al.', 2018),
    createData('Symbiosis and UV radiation: a case study on negative growth rate ...', 'Mark et al', 1998)
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
