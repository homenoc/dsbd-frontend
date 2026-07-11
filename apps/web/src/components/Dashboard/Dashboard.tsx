import AddIcon from '@mui/icons-material/Add';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ChatIcon from '@mui/icons-material/Chat';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FeedbackIcon from '@mui/icons-material/Feedback';
import MenuIcon from '@mui/icons-material/Menu';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import PaymentIcon from '@mui/icons-material/Payment';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import TocIcon from '@mui/icons-material/Toc';
import {
  Box,
  type CSSObject,
  CssBaseline,
  Divider,
  Fade,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  type Theme,
  ThemeProvider,
  Toolbar,
  Typography,
  styled,
} from '@mui/material';
import MuiAppBar, { type AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import Cookies from 'js-cookie';
import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logout } from '../../api/Auth';
import { restfulApiConfig } from '../../api/Config';
import { invalidateAllInfo, useMe } from '../../hooks/useInfo';
import type { InfoData } from '../../interface';
import { queryClient } from '../../lib/queryClient';
import { AntisocialAgreementDialog } from '../AntisocialAgreementDialog';
import { muiColorTheme } from '../Theme';
import { StyledDivDashboardRoot, StyledDivDashboardToolBarIcon } from './styles';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  // 大きい画面の時に、drawerを閉じた時に、アイコンが中心にならないため、コメントアウト
  // width: `calc(${theme.spacing(7)} + 1px)`,
  // [theme.breakpoints.up('sm')]: {
  //  width: `calc(${theme.spacing(9)} + 1px)`,
  // },
});

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

interface DashboardProps {
  title?: string;
  children?: React.ReactNode;
  sx?: CSSObject;
  forceDrawerClosed?: boolean;
}

export default function Dashboard(props: DashboardProps) {
  const navigate = useNavigate();
  const meQ = useMe();
  const infoData = useMemo<InfoData | undefined>(() => {
    if (meQ.isLoading) return undefined;
    return {
      user: meQ.data,
    };
  }, [meQ.data, meQ.isLoading]);
  const userData = infoData?.user;
  const showAntisocialDialog = userData && userData.antisocial_check !== true;
  // Menu Bar
  // useMediaQuery("(min-width:800px)")でmobileかどうかを判定
  const [open, setOpen] = React.useState(useMediaQuery('(min-width:600px)'));

  // 画面サイズが変わったときにopenを変更
  // closeが強制されているときは、openをfalseにする
  const isMobile = !useMediaQuery('(min-width:600px)');
  useEffect(() => {
    if (props.forceDrawerClosed) {
      setOpen(false);
    } else if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile, props.forceDrawerClosed]);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const reloadClick = () => invalidateAllInfo(queryClient);
  const DashboardPage = () => navigate('/dashboard');
  const InfoPage = () => navigate('/dashboard/info');
  const AddPage = () => navigate('/dashboard/add');
  const PaymentPage = () => navigate('/dashboard/payment');
  const SupportPage = () => navigate('/dashboard/support');
  const ProcedurePage = () => navigate('/dashboard/procedure');
  const FeedbackPage = () => navigate('/dashboard/feedback');

  return (
    <ThemeProvider theme={muiColorTheme}>
      <AntisocialAgreementDialog open={showAntisocialDialog ?? false} />
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6">
              AS59105 Service Online
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton color="inherit" onClick={reloadClick}>
                <AutorenewIcon />
              </IconButton>
              {/*<IconButton color="inherit">*/}
              {/*    <Badge badgeContent={0} color="secondary">*/}
              {/*        <NotificationsIcon/>*/}
              {/*    </Badge>*/}
              {/*</IconButton>*/}
              <UserMenu key={'user_menu'} />
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <StyledDivDashboardToolBarIcon>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </StyledDivDashboardToolBarIcon>
          <Divider />
          <List component="nav">
            <ListItemButton onClick={DashboardPage}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={InfoPage}>
              <ListItemIcon>
                <TocIcon />
              </ListItemIcon>
              <ListItemText primary="Info" />
            </ListItemButton>
            <ListItemButton onClick={AddPage}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="申請" />
            </ListItemButton>
            {restfulApiConfig.enableMoney && (
              <ListItemButton onClick={PaymentPage}>
                <ListItemIcon>
                  <PaymentIcon />
                </ListItemIcon>
                <ListItemText primary="会費/寄付" />
              </ListItemButton>
            )}
            <ListItemButton onClick={SupportPage}>
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <ListItemText primary="Support" />
            </ListItemButton>
            <ListItemButton onClick={ProcedurePage}>
              <ListItemIcon>
                <NoteAddOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="各種手続き" />
            </ListItemButton>
            <ListItemButton onClick={FeedbackPage}>
              <ListItemIcon>
                <FeedbackIcon />
              </ListItemIcon>
              <ListItemText primary="Feedback" />
            </ListItemButton>
            <Divider />
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, ...props.sx }}>
          <StyledDivDashboardToolBarIcon />
          <Typography sx={{ m: 1 }} variant="h5" color="inherit">
            {props.title}
          </Typography>
          {props.children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export function UserMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const clickLogout = () => {
    Logout().then((res) => {
      Cookies.remove('user_token');
      Cookies.remove('access_token');
      queryClient.clear();
      navigate('/login');
    });
  };

  return (
    <StyledDivDashboardRoot>
      <IconButton
        color="inherit"
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <PermIdentityIcon />
      </IconButton>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {/*<MenuItem onClick={handleClose}>Profile</MenuItem>*/}
        <MenuItem onClick={clickLogout}>Logout</MenuItem>
      </Menu>
    </StyledDivDashboardRoot>
  );
}
