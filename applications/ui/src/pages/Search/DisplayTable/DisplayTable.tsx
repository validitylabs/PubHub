import React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {RootState} from '../../../store';
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
    displayTable: IWork[];
}

// let id = 0;
// function createData(title: string, author: string, year: number) {
//     id += 1;
//     return {id, title, author, year};
// }

// const inputRows: IWork[] = [
//     createData('Frozen The effect of UV radiation on photosynthetic production of the coral ...', 'Buergel et al.', 2019),
//     createData('A casual relationship between UV radiation and coral bleaching in ...', 'Willy et al.', 2018),
//     createData('Symbiosis and UV radiation: a case study on negative growth rate ...', 'Mark et al', 1998)
// ];

class SampleDisplayTableComponent extends React.Component<IDisplayTableProps> {
    render () {
        const {classes, displayTable} = this.props;
        console.log(displayTable);
        return (
            <React.Fragment>
                <Grid container className={classes.container}>
                    <SimpleTable rows={displayTable} />
                </Grid>
            </React.Fragment>
        );
    }
};

const styledSampleDisplayTableComponent = withStyles(styles)(SampleDisplayTableComponent);

const mapStateToProps = ({displayTable}: RootState) => ({
    displayTable
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    // updateTable: (works: IDisplayedWork[]) => dispatch(updateDisplayedWorksAction(works)),
});

const DisplayTable = connect(
    mapStateToProps,
    mapDispatchToProps
)(styledSampleDisplayTableComponent);


export {DisplayTable};
