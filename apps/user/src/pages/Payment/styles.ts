import { CardHeader, styled } from '@mui/material'

export const StyledDivCardPricing = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'baseline',
  marginBottom: theme.spacing(2),
}))

export const StyledCardHeader1 = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.grey[700],
}))
