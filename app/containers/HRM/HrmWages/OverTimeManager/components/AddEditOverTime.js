/**
 *
 * AddWageSalary
 *
 */

import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField, Tooltip, Typography } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CustomButton from 'components/Button/CustomButton';
import Department from 'components/Filter/DepartmentAndEmployee';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import CustomInputBase from 'components/Input/CustomInputBase';
import PropTypes from 'prop-types';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { compose } from 'redux';
import { API_HRM_EMPLOYEE } from 'config/urlConfig';
import { AsyncAutocomplete } from 'components/LifetekUi';
import { viewConfigCheckForm, viewConfigCheckRequired, viewConfigHandleOnChange, viewConfigName2Title } from 'utils/common';
import NumberFormat from 'react-number-format';
/* eslint-disable react/prefer-stateless-function */
function AddWageSalary(props) {
  const { onSave, onClose, code, open, onChangeSnackbar, data, profile } = props;
  const [localState, setLocalState] = useState({
    timeStart: '',
    timeEnd: '',
    month: '',
    year: '',
    reason: '',
    organizationUnitId: '',
  });
  const [name2Title, setName2Title] = useState({});
  const [checkRequired, setCheckRequired] = useState({});
  const [checkShowForm, setCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});

  const isEmptyObject = obj => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  useEffect(() => {
    const code = props.code;
    const newNam2Title = viewConfigName2Title(code);
    setName2Title(newNam2Title);
    const checkRequired = viewConfigCheckRequired(code, 'required');
    const checkShowForm = viewConfigCheckRequired(code, 'showForm');
    setCheckRequired(checkRequired);
    setCheckShowForm(checkShowForm);
    const messages = viewConfigCheckForm(code, localState);
    setLocalMessages(messages);
    return () => {
      newNam2Title;
      checkRequired;
      checkShowForm;
      localMessages;
    };
  }, []);
  useEffect(
    () => {
      if (data && !isEmptyObject(data)) {
        const localHrmEmployeeId = {
          _id: '',
          name: '',
        };
        localHrmEmployeeId._id = data['hrmEmployeeId._id'];
        localHrmEmployeeId.name = data['hrmEmployeeId.name'];
        localHrmEmployeeId.code = data['hrmEmployeeId.code'];
        setLocalState({ ...data, organizationUnitId: data['organizationUnit._id'], hrmEmployeeId: localHrmEmployeeId });
        const messages = viewConfigHandleOnChange(code, localMessages, 'month', data.month);
        setLocalMessages(messages);
      } else {
        const nowDate = new Date();
        const messages = viewConfigHandleOnChange(code, localMessages, 'month', nowDate.getMonth() + 1);
        setLocalMessages(messages);
        setLocalState({
          month: nowDate.getMonth() + 1,
          year: nowDate.getFullYear(),
        });
      }
    },
    [data],
  );

  const handleInputChangeMonth = e => {
    if (Number(e.target.value) > 0 && Number(e.target.value) < 13) {
      setLocalState({ ...localState, [e.target.name]: e.target.value });
    } else {
      setLocalState({ ...localState, [e.target.name]: e.target.value.slice(0, -1) });
    }
    const messages = viewConfigHandleOnChange(code, localMessages, e.target.name, Number(e.target.value));
    setLocalMessages(messages);
  };

  const handleInputChangeYear = e => {
    e.target.value = e.target.value.replace(/^(0|\+?[1-9][0-9][0-9][0-9][0-9]\d*)$/);
    setLocalState({ ...localState, [e.target.name]: e.target.value });
    const messages = viewConfigHandleOnChange(code, localMessages, e.target.name, Number(e.target.value));
    setLocalMessages(messages);
  };

  const handleInputChange = e => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
    const messages = viewConfigHandleOnChange(code, localMessages, e.target.name, e.target.value);
    setLocalMessages(messages);
  };
  const handleInputChangeText = e => {
    e.target.value = e.target.value.replace('<>', '');
    e.target.value = e.target.value.replace('</>', '');
    e.target.value = e.target.value.replace('<html>', '');
    e.target.value = e.target.value.replace('</html>', '');
    setLocalState({ ...localState, [e.target.name]: e.target.value });
    const messages = viewConfigHandleOnChange(code, localMessages, e.target.name, e.target.value);
    setLocalMessages(messages);
  };

  const handleInputChangeEmp = useCallback(
    e => {
      setLocalState({ ...localState, hrmEmployeeId: e });
      // const messages = viewConfigHandleOnChange(code, localMessages, e.target.name, e.target.value);
      // setLocalMessages(messages);
    },
    [localState],
  );

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  const handeChangeDepartment = useCallback(
    result => {
      const { department, employee } = result;
      setLocalState({ ...localState, organizationUnitId: department, hrmEmployeeId: employee });
    },
    [localState],
  );

  const handleSave = () => {
    const messages = viewConfigCheckForm(props.code, localState);
    if (localState.month && localState.year && localState.organizationUnitId && localState.inChargedEmployeeId !== null) {
      if (Object.values(messages).filter(v => v).length) {
        return props.onChangeSnackbar({ variant: 'error', message: 'Vui l??ng nh???p ?????y ????? c??c tr?????ng th??ng tin', status: true });
      }
      onSave(localState);
      setLocalState({});
      props.onClose()
      console.log(props, "handleCloseDialog")
    } else {
      if (!localState.month) {
        setLocalMessages({ ...localMessages, month: 'Kh??ng ???????c ????? tr???ng th??ng' });
      } else {
        delete localMessages.month;
      }
      if (!localState.year) {
        setLocalMessages({ ...localMessages, year: 'Kh??ng ???????c ????? tr???ng n??m' });
      } else {
        delete localMessages.year;
      }
      if (!localState.organizationUnitId) {
        onChangeSnackbar({ status: true, message: 'Kh??ng ???????c ????? tr???ng ph??ng ban', variant: 'error' });
      }
      if (localState.inChargedEmployeeId === null) {
        onChangeSnackbar({ status: true, message: 'Kh??ng ???????c ????? tr???ng ng?????i ph??? tr??ch', variant: 'error' });
      }
    }
  };
  const handleClose = () => {
    setLocalState({});
    onClose();
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <Grid item >
          <DialogTitle id="alert-dialog-title">{data && !isEmptyObject(data) ? 'S???a th???i gian t??ng ca' : 'Th??m th???i gian t??ng ca'}</DialogTitle>
          <DialogContent >
            <Grid container direction="row" alignItems="flex-start" spacing={8}>
              <Grid item xs={12}>
                <Department
                  onChange={handeChangeDepartment}
                  department={localState.organizationUnitId}
                  isHrm
                  employee={localState.hrmEmployeeId}
                  profile={profile}
                  moduleCode="HrmOverTime"
                />
              </Grid>

              <Grid item xs={6}>
                <CustomInputBase
                  type="time"
                  label={'Th???i gian b???t ?????u'}
                  value={localState.timeStart}
                  name="timeStart"
                  onChange={handleInputChange}
                  required={checkRequired && checkRequired.timeStart}
                  checkedShowForm={checkShowForm && checkShowForm.timeStart}
                  error={localMessages && localMessages.timeStart}
                  helperText={localMessages && localMessages.timeStart}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomInputBase
                  type="time"
                  label={'Th???i gian k???t th??c'}
                  value={localState.timeEnd}
                  name="timeEnd"
                  onChange={handleInputChange}
                  required={checkRequired && checkRequired.timeEnd}
                  checkedShowForm={checkShowForm && checkShowForm.timeEnd}
                  error={localMessages && localMessages.timeEnd}
                  helperText={localMessages && localMessages.timeEnd}
                />
              </Grid>
              <Grid item xs={6}>
                <NumberFormat
                  label={'Th??ng'}
                  value={localState.month}
                  name="month"
                  onChange={handleInputChangeMonth}
                  margin="normal"
                  customInput={CustomInputBase}
                  allowNegative={false}
                  decimalSeparator={null}
                  required={checkRequired && checkRequired.month}
                  checkedShowForm={checkShowForm && checkShowForm.month}
                  error={localMessages && localMessages.month}
                  helperText={localMessages && localMessages.month}
                />
              </Grid>

              <Grid item xs={6}>
                <NumberFormat
                  label={'N??m'}
                  value={localState.year}
                  name="year"
                  onChange={handleInputChangeYear}
                  margin="normal"
                  customInput={CustomInputBase}
                  allowNegative={false}
                  decimalSeparator={null}
                  required={checkRequired && checkRequired.year}
                  checkedShowForm={checkShowForm && checkShowForm.year}
                  error={localMessages && localMessages.year}
                  helperText={localMessages && localMessages.year}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomInputBase
                  // label={getLabelName('description', 'Stock')}
                  label={'GHI CH??'}
                  multiline
                  rows={3}
                  name="reason"
                  value={localState.reason}
                  onChange={handleInputChangeText}
                // required={checkRequired && checkRequired.formula}
                // checkedShowForm={checkShowForm && checkShowForm.formula}
                // error={localMessages && localMessages.formula}
                // helperText={localMessages && localMessages.formula}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomGroupInputField code="HrmOverTime" columnPerRow={2} value={localState.others} onChange={handleOtherDataChange} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions  >
            <Grid item xs={12}>
              <Grid container spacing={8} justify="flex-end">
                <Grid item>
                  <CustomButton color="primary" varian="outlined" onClick={() => handleSave()}>
                    L??u
                  </CustomButton>
                </Grid>
                <Grid item>
                  <CustomButton varian="outlined" color="secondary" onClick={e => handleClose()}>
                    H???Y
                  </CustomButton>
                </Grid>
              </Grid>
            </Grid>
          </DialogActions>
        </Grid>
      </Dialog>
    </>
  );
}

AddWageSalary.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

export default compose(memo)(AddWageSalary);
