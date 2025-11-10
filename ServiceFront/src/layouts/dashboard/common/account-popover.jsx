import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'src/routes/hooks';

// Menu items shown inside the popover
const MENU_OPTIONS = [
  { label: 'Home', path: '/' },
  { label: 'Profile', path: '/profile' },
  { label: 'Settings', path: '/settings' },
];

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [account, setAccount] = useState(null);
  const router = useRouter();

  // ✅ Check user cookie every time it changes (real-time)
  useEffect(() => {
    const updateAccount = () => {
      const userCookie = Cookies.get('user');
      if (userCookie) {
        const userData = JSON.parse(userCookie);
        setAccount({
          displayName: userData.servicename || 'User',
          email: userData.email || '',
          photoURL: '/assets/images/avatars/avatar_25.jpg',
        });
      } else {
        setAccount(null);
      }
    };

    // Run once on mount
    updateAccount();

    // Listen to cookie changes using interval (since Cookies lib doesn’t emit events)
    const interval = setInterval(updateAccount, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = (event) => setOpen(event.currentTarget);
  const handleClose = () => setOpen(null);

  const handleLogout = () => {
    Cookies.remove('user');
    setAccount(null);
    handleClose();
  };

  // ✅ If NOT logged in → show Login & Signup buttons instead of Avatar
  if (!account) {
    return (
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => router.push('/login')}
        >
          Login
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => router.push('/signup')}
        >
          Sign Up
        </Button>
      </Stack>
    );
  }

  // ✅ If logged in → show Avatar popover
  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={account.photoURL}
          alt={account.displayName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {account.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { p: 0, mt: 1, ml: 0.75, width: 200 },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {account.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            onClick={() => {
              handleClose();
              router.push(option.path);
            }}
          >
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
