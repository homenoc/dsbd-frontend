import { Avatar, Button, styled } from '@mui/material'

// paper
export const StyledPaper = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}))

// avatar
export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
}))

// form
export const StyledForm = styled('form')(({ theme }) => ({
  width: '100%', // Fix IE 11 issue.
  marginTop: theme.spacing(3),
}))

// submit
export const StyledButtonSubmit = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}))
