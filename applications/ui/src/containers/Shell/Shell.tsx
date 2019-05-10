import React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {store, RootState} from '../../store';
// import {IAuthState} from '../../store/auth/auth.types';
// import {logout as logoutAction} from '../../store/auth/auth.actions';
import {IAccount, AccountState} from '../../store/ethereum/ethereum.types';
import {
    updateAccount as updateAccountAction,
    updateIpfs as updateIpfsAction,
    logoutAccount as logoutAccountAction
} from '../../store/ethereum/ethereum.actions';
import classNames from 'classnames';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import {withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import {NavLink} from 'react-router-dom';
import logo from '../../images/logo.png';
import {Link} from '../../components/Link';
import {FloatProperty, UserSelectProperty} from 'csstype';
import {getCurrentAddress, isInstalled} from '../../libs/web3';

const drawerWidth = 240;

const styles = (theme: Theme) => ({
    root: {
        display: 'flex'
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex'
        }
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none'
        }
    },
    hide: {
        display: 'none'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end'
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginLeft: -drawerWidth
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0
    },
    logoLink: {
        userSelect: 'none' as UserSelectProperty,
        display: 'block',
        color: theme.palette.common.white,
        width: 'auto',
        [theme.breakpoints.up('md')]: {
            width: 130
        }
    },
    logoLinkA: {
        transition: 'all .2s ease-in-out',
        '&:hover': {
            transform: 'scale(1.02)'
        }
    },
    logo: {
        marginRight: 10,
        height: 32,
        float: 'left' as FloatProperty
    },
    logoText: {
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    }
});

// interface IAuthCallbackStateProps {
//     auth: IAuthState;
// }

// interface IAuthCallbackDispatchProps {
//     logout(): void;
// }

interface IEthereumAccountStateProps {
    ethereumAccount: AccountState;
}

interface IEthereumAccountDispatchProps {
    updateAccount(address: string): void;
    updateIpfs(ipfsDigest: string): void;
    logoutAccount(): void;
}

// export interface IShellComponentProps extends IAuthCallbackStateProps, IAuthCallbackDispatchProps {
export interface IShellComponentProps extends IEthereumAccountStateProps, IEthereumAccountDispatchProps {
    // export interface IShellComponentProps {
    classes: {
        logo: string;
        logoLink: string;
        logoLinkA: string;
        logoText: string;
        root: string;
        appBar: string;
        appBarShift: string;
        grow: string;
        menuButton: string;
        sectionDesktop: string;
        sectionMobile: string;
        hide: string;
        drawer: string;
        drawerPaper: string;
        drawerHeader: string;
        content: string;
        contentShift: string;
    };
    theme: Theme;
    children: React.ReactNode;
    enableHeaderAndDrawer?: boolean;
    disableNavigation?: boolean;
}

const HomeLink = (props: any) => <NavLink to="/home" exact={false} {...props} />;
const SearchLink = (props: any) => <NavLink to="/search" exact={false} {...props} />;
const ProjectsLink = (props: any) => <NavLink to="/projects" exact={false} {...props} />;
const RelevantWorksLink = (props: any) => <NavLink to="/works" exact={false} {...props} />;

class ShellComponent extends React.Component<IShellComponentProps> {
    static defaultProps = {
        enableHeaderAndDrawer: false,
        disableNavigation: false
    };

    state = {
        open: false,
        anchorEl: null,
        mobileMoreAnchorEl: null
    };

    handleDrawerOpen = () => {
        this.setState({open: true});
    };

    handleDrawerClose = () => {
        this.setState({open: false});
    };

    handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleMenuClose = () => {
        this.setState({anchorEl: null});
        this.handleMobileMenuClose();
    };

    handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        this.setState({mobileMoreAnchorEl: event.currentTarget});
    };

    handleMobileMenuClose = () => {
        this.setState({mobileMoreAnchorEl: null});
    };

    handleLogoutClick = () => {
        // const {logout} = this.props;
        // logout();
        // this.handleMenuClose();
    };

    renderUserMenu() {
        const {anchorEl} = this.state;
        const isMenuOpen = Boolean(anchorEl);

        return (
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                open={isMenuOpen}
                onClose={this.handleMenuClose}
            >
                <MenuItem onClick={this.handleLogoutClick}>Logout</MenuItem>
            </Menu>
        );
    }

    renderMobileMenu() {
        const {mobileMoreAnchorEl} = this.state;
        const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

        return (
            <Menu
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                open={isMobileMenuOpen}
                onClose={this.handleMobileMenuClose}
            >
                <MenuItem>
                    <IconButton color="inherit">
                        <Badge badgeContent={4} color="secondary">
                            <MailIcon />
                        </Badge>
                    </IconButton>
                    <p>Messages</p>
                </MenuItem>
                <MenuItem>
                    <IconButton color="inherit">
                        <Badge badgeContent={11} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <p>Notifications</p>
                </MenuItem>
                <MenuItem onClick={this.handleProfileMenuOpen}>
                    <IconButton color="inherit">
                        <AccountCircle />
                    </IconButton>
                    <p>Profile</p>
                </MenuItem>
            </Menu>
        );
    }

    async componentDidMount() {
        await isInstalled();
        const {updateAccount} = this.props;
        const signerAddress: string = await getCurrentAddress();
        updateAccount(signerAddress[0]);
        console.log(' [componentDidMount reducer] ', store.getState().ethereumAccount);
    }

    render() {
        const {enableHeaderAndDrawer, disableNavigation, children} = this.props;

        if (enableHeaderAndDrawer) {
            // const {classes, theme, auth} = this.props;
            const {classes, theme} = this.props;
            const {open, anchorEl} = this.state;
            // eslint-disable-next-line
            const _isMenuOpen = Boolean(anchorEl);

            return (
                <div className={classes.root}>
                    <CssBaseline />

                    <AppBar
                        position="fixed"
                        className={classNames(classes.appBar, {
                            [classes.appBarShift]: open
                        })}
                    >
                        <Toolbar disableGutters={!open}>
                            {disableNavigation ? (
                                <React.Fragment>
                                    <div className={classes.menuButton} />
                                    <Typography variant="h6" className={classes.logoLink}>
                                        <img className={classes.logo} src={logo} alt={'project logo'} />
                                    </Typography>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <IconButton
                                        color="inherit"
                                        aria-label="Open drawer"
                                        onClick={this.handleDrawerOpen}
                                        className={classNames(classes.menuButton, open && classes.hide)}
                                    >
                                        <MenuIcon />
                                    </IconButton>

                                    <Link variant="h6" underline="none" to="/" className={classNames(classes.logoLink, classes.logoLinkA)}>
                                        <img className={classes.logo} src={logo} alt={'Other logo'} />
                                    </Link>
                                </React.Fragment>
                            )}

                            <div className={classes.grow} />

                            <div className={classNames(classes.sectionDesktop, disableNavigation ? classes.hide : null)}>
                                <IconButton color="inherit">
                                    <Badge badgeContent={0} color="secondary">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                                {/* {auth.isAuthenticated ? (
                                    <IconButton
                                        aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                                        aria-haspopup="true"
                                        onClick={this.handleProfileMenuOpen}
                                        color="inherit"
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                ) : null} */}
                                {/* trying to show an account icon by default */}
                                {/* {currentAddress === null ? null : <Typography>{currentAddress}</Typography>} */}
                                {/* <Typography>{currentAddress}</Typography> */}
                                <IconButton aria-haspopup="true" color="inherit">
                                    <AccountCircle />
                                </IconButton>
                                {this.renderUserMenu()}
                            </div>

                            {disableNavigation ? null : (
                                <div className={classes.sectionMobile}>
                                    <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                                        <MoreIcon />
                                    </IconButton>
                                </div>
                            )}
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        className={classes.drawer}
                        variant="persistent"
                        anchor="left"
                        open={open}
                        classes={{
                            paper: classes.drawerPaper
                        }}
                    >
                        <div className={classes.drawerHeader}>
                            <IconButton onClick={this.handleDrawerClose}>{theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
                        </div>
                        <Divider />
                        <List>
                            <ListItem button key={'Home'} component={HomeLink}>
                                <ListItemText primary={'Home'} />
                            </ListItem>
                            <ListItem button key={'Search'} component={SearchLink}>
                                <ListItemText primary={'Search'} />
                            </ListItem>
                            <ListItem button key={'Projects'} component={ProjectsLink}>
                                <ListItemText primary={'Own projects'} />
                            </ListItem>
                            <ListItem button key={'Relevant works'} component={RelevantWorksLink}>
                                <ListItemText primary={'Relevant works'} />
                            </ListItem>
                        </List>
                    </Drawer>
                    <main
                        className={classNames(classes.content, {
                            [classes.contentShift]: open
                        })}
                    >
                        <div className={classes.drawerHeader} />
                        {children}
                    </main>
                </div>
            );
        }

        return <main>{children}</main>;
    }
}

export const StyledShellComponent = withStyles(styles, {withTheme: true})(ShellComponent);

const mapStateToProps = ({ethereumAccount}: RootState) => ({
    // auth
    ethereumAccount
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    // logout: () => dispatch(logoutAction())
    updateAccount: (address: string) => dispatch(updateAccountAction(address)),
    updateIpfs: (ipfsDigest: string) => dispatch(updateIpfsAction(ipfsDigest)),
    logoutAccount: () => dispatch(logoutAccountAction())
});

const Shell = connect(
    mapStateToProps,
    mapDispatchToProps
)(StyledShellComponent);

export {Shell};
