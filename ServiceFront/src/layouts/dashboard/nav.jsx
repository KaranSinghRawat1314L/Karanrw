import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { RouterLink } from 'src/routes/components';
import { useRouter, usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import navConfig from './config-navigation';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const router = useRouter();
  const pathname = usePathname();
  const upLg = useResponsive('up', 'lg');

  const [account, setAccount] = useState({
    displayName: 'Guest User',
    email: 'Not Logged In',
    photoURL: '/assets/images/avatars/avatar_25.jpg',
  });

  // ✅ Function to check and update user info from cookies
  const checkUserCookie = () => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        setAccount({
          displayName: userData.servicename || 'User',
          email: userData.email || 'No email available',
          photoURL: '/assets/images/avatars/avatar_25.jpg',
        });
      } catch (err) {
        console.error('Invalid cookie data', err);
      }
    } else {
      setAccount({
        displayName: 'Guest User',
        email: 'Not Logged In',
        photoURL: '/assets/images/avatars/avatar_25.jpg',
      });
    }
  };

  // ✅ Run check initially and every second to sync cookies
  useEffect(() => {
    checkUserCookie();
    const interval = setInterval(checkUserCookie, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Close nav when route changes
  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ✅ Logout handler
  const handleLogout = () => {
    Cookies.remove('user');
    setAccount({
      displayName: 'Guest User',
      email: 'Not Logged In',
      photoURL: '/assets/images/avatars/avatar_25.jpg',
    });
    router.push('/'); // stay on dashboard
  };

  // -------------------------
  // Account box
  // -------------------------
  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 1.5,
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      {account.email === 'Not Logged In' ? (
        <>
          <Avatar src={account.photoURL} alt="Guest" sx={{ mb: 1, width: 64, height: 64 }} />
          <Typography variant="subtitle2">{account.displayName}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => router.push('/login')}
            >
              Login
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => router.push('/signup')}
            >
              Signup
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Avatar src={account.photoURL} alt={account.displayName} sx={{ mb: 1, width: 64, height: 64 }} />
          <Typography variant="subtitle2">{account.displayName}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {account.email}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            color="error"
            sx={{ mt: 2 }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </>
      )}
    </Box>
  );

  // -------------------------
  // Navigation list
  // -------------------------
  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  // -------------------------
  // Sidebar content
  // -------------------------
  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4 }} />
      {renderAccount}
      {renderMenu}
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();
  const active = item.path === pathname;

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title}</Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
