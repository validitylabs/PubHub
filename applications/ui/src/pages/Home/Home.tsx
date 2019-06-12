import React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {store, RootState} from '../../store';
import {NavLink} from 'react-router-dom';
import {withStyles, createStyles, Grid} from '@material-ui/core';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import PageTitle from '../../components/PageTitle';
import {TextEditor} from '../../components/TextEditor';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import createimg from '../../images/create.jpg';
import searchimg from '../../images/search.jpg';
import projectsimg from '../../images/projects.jpg';
import referenceimg from '../../images/reference.jpg';
import {IContent} from '../../store/content/content.types';
import {writeContentEditor as writeContentEditorAction} from '../../store/content/content.actions';

const styles = (theme: Theme) =>
    createStyles({
        container: {
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: '800px',
            marginBottom: '5vh'
        },
        root: {
            flexGrow: 1,
            marginTop: '3vh'
        },
        image: {
            position: 'relative',
            height: 200,
            [theme.breakpoints.down('xs')]: {
                width: '100% !important', // Overrides inline-style
                height: 100
            },
            '&:hover, &$focusVisible': {
                zIndex: 1,
                '& $imageBackdrop': {
                    opacity: 0.15
                },
                '& $imageMarked': {
                    opacity: 0
                },
                '& $imageTitle': {
                    border: '4px solid currentColor'
                }
            }
        },
        focusVisible: {},
        imageButton: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.palette.common.white
        },
        imageSrc: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%'
        },
        imageBackdrop: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: theme.palette.common.black,
            opacity: 0.4,
            transition: theme.transitions.create('opacity')
        },
        imageTitle: {
            position: 'relative',
            padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme.spacing.unit + 6}px`
        },
        imageMarked: {
            height: 3,
            width: 18,
            backgroundColor: theme.palette.common.white,
            position: 'absolute',
            bottom: -2,
            left: 'calc(50% - 9px)',
            transition: theme.transitions.create('opacity')
        }
    });

interface IContentDisplayProps {
    open: boolean;
    lastUpdateTime: Date;
    displayEditor(): void;
    closeEditor(): void;
}
export interface IHomeProps extends IContentDisplayProps {
    classes: {
        container: string;
        root: string;
        image: string;
        focusVisible: string;
        imageButton: string;
        imageSrc: string;
        imageBackdrop: string;
        imageTitle: string;
        imageMarked: string;
    };
}

const HomeLink = (props: any) => <NavLink to="/home" exact={false} {...props} />;
const SearchLink = (props: any) => <NavLink to="/search" exact={false} {...props} />;
const ProjectsLink = (props: any) => <NavLink to="/projects" exact={false} {...props} />;
const RelevantWorksLink = (props: any) => <NavLink to="/works" exact={false} {...props} />;

const images = [
    {
        url: searchimg,
        title: 'Search',
        width: '100%',
        link: SearchLink,
        other: ''
    },
    {
        url: createimg,
        title: 'Create work',
        width: '100%',
        link: HomeLink,
        other: 'TEXT_EDITOR'
    },
    {
        url: projectsimg,
        title: 'Own projects',
        width: '100%',
        link: ProjectsLink,
        other: ''
    },
    {
        url: referenceimg,
        title: 'Relevant work',
        width: '100%',
        link: RelevantWorksLink,
        other: ''
    }
];

const defaultContentState: IContent = {
    id: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '',
    title: '',
    text: ''
};

class HomeComponent extends React.Component<IHomeProps> {
    handleClickOpen = () => {
        const {displayEditor} = this.props;
        console.log(store.getState());
        displayEditor();
    };

    render() {
        const {classes} = this.props;

        return (
            <React.Fragment>
                <Grid container className={classes.container} direction="column" spacing={8}>
                    <Grid item>
                        <PageTitle text="Welcome to PubHub!" />
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                            A decentralised publication management platform.
                        </Typography>
                    </Grid>
                    <div className={classes.root}>
                        <Grid container spacing={40}>
                            {images.map((image) => (
                                <Grid item xs={12} sm={6} key={image.title}>
                                    <ButtonBase
                                        focusRipple
                                        key={image.title}
                                        className={classes.image}
                                        focusVisibleClassName={classes.focusVisible}
                                        component={image.other === 'TEXT_EDITOR' ? 'button' : image.link}
                                        onClick={image.other === 'TEXT_EDITOR' ? this.handleClickOpen : undefined}
                                        style={{
                                            width: image.width
                                        }}
                                    >
                                        <span
                                            className={classes.imageSrc}
                                            style={{
                                                backgroundImage: `url(${image.url})`
                                            }}
                                        />
                                        <span className={classes.imageBackdrop} />
                                        <span className={classes.imageButton}>
                                            <Typography component="span" variant="h5" color="inherit" className={classes.imageTitle}>
                                                {image.title}
                                                <span className={classes.imageMarked} />
                                            </Typography>
                                        </span>
                                    </ButtonBase>
                                </Grid>
                            ))}
                        </Grid>
                        <Grid item>
                            <TextEditor />
                        </Grid>
                    </div>
                </Grid>
            </React.Fragment>
        );
    }
}

const StyledHomeComponent = withStyles(styles, {withTheme: true})(HomeComponent);

const mapStateToProps = ({contentEditor}: RootState) => ({
    open: contentEditor.display
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    displayEditor: () => dispatch(writeContentEditorAction(defaultContentState))
});

const Home = connect(
    mapStateToProps,
    mapDispatchToProps
)(StyledHomeComponent);

export {Home};
