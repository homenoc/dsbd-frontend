import { isActive } from '@dsbd/shared';
import {
  Button,
  CardActions,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard/Dashboard';
import { useGroups } from '../../hooks/useResources';
import type { GroupDetailData } from '../../interface';
import {
  StyledCard,
  StyledInputBase,
  StyledPaperRootInput,
  StyledTypographyTitle,
} from '../Dashboard/styles';

export default function Group() {
  const { data: initGroups, error } = useGroups();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // 1:有効 2:無効
  const [value, setValue] = React.useState(1);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(String((error as Error).message), { variant: 'error' });
    }
  }, [error]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  const checkGroup = (group: GroupDetailData) => {
    if (value === 1) {
      return isActive(group.expired_status);
    }
    if (value === 2) {
      return !isActive(group.expired_status);
    }
    return true;
  };

  const groups =
    search === ''
      ? initGroups
      : initGroups.filter((grp: GroupDetailData) => {
          return grp.org_en.toLowerCase().includes(search.toLowerCase());
        });

  const handleFilter = (value: string) => {
    setSearch(value);
  };

  const clickDetailPage = (id: number) => navigate('/dashboard/group/' + id);

  return (
    <Dashboard title="Group Info">
      <StyledPaperRootInput>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          onChange={(event) => {
            handleFilter(event.target.value);
          }}
        />
      </StyledPaperRootInput>
      <FormControl component="fieldset">
        <RadioGroup row aria-label="gender" name="open" value={value} onChange={handleChange}>
          <FormControlLabel value={1} control={<Radio color="primary" />} label="有効" />
          <FormControlLabel value={2} control={<Radio color="secondary" />} label="無効" />
        </RadioGroup>
      </FormControl>
      {groups
        .filter((group) => checkGroup(group))
        .map((group: GroupDetailData) => (
          <StyledCard key={'group_id_' + group.ID}>
            <CardContent>
              <StyledTypographyTitle color="textSecondary" gutterBottom>
                ID: {group.ID}
              </StyledTypographyTitle>
              <Typography variant="h5" component="h2">
                {group.org} ({group.org_en})
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="outlined" onClick={() => clickDetailPage(group.ID)}>
                Detail
              </Button>
            </CardActions>
          </StyledCard>
        ))}
    </Dashboard>
  );
}
