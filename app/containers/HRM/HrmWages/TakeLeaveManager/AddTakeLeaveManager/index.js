import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField } from '@material-ui/core';
import React, { memo, useEffect, useState, useCallback } from 'react';
import { compose } from 'redux';
import CustomButton from 'components/Button/CustomButton';
import CustomInputBase from 'components/Input/CustomInputBase';
import { AsyncAutocomplete, Autocomplete } from 'components/LifetekUi';
import { API_PERSONNEL, API_HRM_EMPLOYEE, API_TAKE_LEAVE } from 'config/urlConfig';
import { fetchData } from '../../../../../helper';
import Department from 'components/Filter/DepartmentAndEmployee';
import moment from 'moment';
import CustomDatePicker from '../../../../../components/CustomDatePicker';
import CustomGroupInputField from '../../../../../components/Input/CustomGroupInputField';
import { viewConfigCheckForm, viewConfigCheckRequired, viewConfigHandleOnChange } from '../../../../../utils/common';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';

function AddTakeLeaveManager(props) {
  const { onSave, onClose, data, name2Title, open, profile, onChangeSnackbar } = props;
  const code = 'TakeLeave';
  const [localData, setLocalData] = useState({
    // hrmEmployeeId: {},
    date: '',
    approved: [],
    type: '',
    reason: '',
    toDate:moment(),
    fromDate:moment()
  });

  const [vacationMode, setVactionMode] = useState([]);
  const [reload, setReload] = useState(new Date() * 1);
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  useEffect(() => {
    setLocalCheckRequired(viewConfigCheckRequired(code, 'required'));
    setLocalCheckShowForm(viewConfigCheckRequired(code, 'showForm'));
  }, []);
  useEffect(() => {
    const messages = viewConfigCheckForm(code, {...localData, "type.title": localData.type});
    setLocalMessages(messages)
  }, [])
  useEffect(() => {
    const viewConfig = JSON.parse(localStorage.getItem('hrmSource')) || null;
    const viewConfigCode = viewConfig ? viewConfig.filter(item => item.code === 'S19') : null;
    const data = viewConfigCode ? viewConfigCode[0].data : null;
    setVactionMode(data);
  }, []);
  useEffect(
    () => {
      console.log(data, "data")
      if (data && data.originItem) {
        fetchData(`${API_TAKE_LEAVE}/${props.data._id}`)
          .then(dataEpl => {

            setLocalData({
              _id: data.originItem._id,
              reason: data.originItem.reason,
              date: data.originItem.date ? moment(data.originItem.date).format('YYYY-MM-DD') : '',
              date: data.originItem.date,
              hrmEmployeeId: { _id: data.originItem.hrmEmployeeId, name: data.originItem.name, code: dataEpl.hrmEmployeeId.code },
              organizationUnitId: data.organizationUnitId || data.originItem.organizationUnitId,
              type: data.originItem.type,
              fromDate: data.originItem.fromDate,
              toDate: data.originItem.toDate
            });
          })
          .catch(() => {
            setLocalData({
              _id: data.originItem._id,
              reason: data.originItem.reason,
              date: data.originItem.date ? moment(data.originItem.date).format('YYYY-MM-DD') : '',
              date: data.originItem.date,
              hrmEmployeeId: { _id: data.originItem.hrmEmployeeId, name: data.originItem.name },
              organizationUnitId: data.originItem.organizationUnitId,
              type: data.originItem.type,
              fromDate: data.originItem.fromDate,
              toDate: data.originItem.toDate
            });
          });
      } else {
        setLocalData({
          toDate:moment(),
          fromDate:moment()
        });
      }
    },
    [data],
  );

  const handleChange = useCallback(
    (e, fieldName) => {
      const messages = viewConfigHandleOnChange('TakeLeave', localMessages, fieldName, e.target.value);
      setLocalMessages(messages);
      const {
        target: { value, name },
      } = e;
      setLocalData({
        ...localData,
        [name]: value,
      });
    
    },
    [localData],
  );

  const handleInputChange = (e, fieldName) => {
    const messages = viewConfigHandleOnChange('TakeLeave', localMessages, fieldName, value);
    setLocalMessages(messages);
    // const name = 'date';
    const value = moment(e);
    setLocalData({ ...localData, [fieldName]: value });
    
  };

  const handeChangeDepartment = useCallback(
    result => {
      const { department, employee} = result;    
      setLocalData({ ...localData, organizationUnitId: department, hrmEmployeeId: employee});
    },
    [localData],
  );

  // const handleOtherDataChange = useCallback(
  //   newOther => {
  //     setLocalData(state => ({ ...state, others: newOther }));
  //   },
  //   [localData],
  // );

  const getSelectedValue = val => {
    if (!val) return null;
    return vacationMode.find(i => i._id === val._id);
  };
  const handleSave = () => {
    // check th???i gian b???t ?????u v?? th???i gian k???t th??c
    const newDate = moment()
    const diffNowStart = moment(localData.fromDate).diff(newDate, "minutes")
    const diffNowEnd = moment(localData.toDate).diff(newDate, "minutes")

    if (localData.organizationUnitId && localData.hrmEmployeeId !== null) {
      if(diffNowStart >= 0 && diffNowEnd >= 0){

        const diffStartEnd = moment(localData.toDate).diff(moment(localData.fromDate), "minutes")
        if(diffStartEnd >= 0){
          onSave(localData);
        }else {
          onChangeSnackbar({ status: true, message: 'Th???i gian b???t ?????u ph???i b?? h??n ho???c b???ng th???i gian k???t th??c', variant: 'error' });
        }
      }else {
        onChangeSnackbar({ status: true, message: 'Th???i gian b???t ?????u ho???c th???i gian k???t th??c kh??ng ???????c b?? h??n th???i gian hi???n t???i', variant: 'error' });
      }
    } else {
      if (!localData.organizationUnitId) {
        onChangeSnackbar({ status: true, message: 'Kh??ng ???????c ????? tr???ng ph??ng ban', variant: 'error' });
      }
      if (localData.hrmEmployeeId === null) {
        onChangeSnackbar({ status: true, message: 'Kh??ng ???????c ????? tr???ng nh??n vi??n', variant: 'error' });
      }
    }
   
  };

  const handleClose = () => {
    onClose();
    setLocalData({});
  };
  return (
    <React.Fragment>
     
      <Dialog open={open} onClose={onClose} maxWidth="md">
        <DialogTitle id="alert-dialog-title">{data && data.originItem ? 'S???a ngh??? ph??p' : 'Th??m ngh??? ph??p'}</DialogTitle>
        <DialogContent style={{ height: 450 }}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Department
                onChange={handeChangeDepartment}
                department={localData.organizationUnitId}
                departmentClone={localData.organizationUnitId}
                employeeClone={localData.hrmEmployeeId}
                isHrm
                employee={localData.hrmEmployeeId}
                errorEmployee={!localData.hrmEmployeeId ? "kh??ng ???????c ????? tr???ng NH??N VI??N" : ''}
                profile={profile}
                moduleCode="TakeLeave"
               error={!localData.organizationUnitId}
               helperText={!localData.organizationUnitId ? 'kh??ng ???????c ????? tr???ng PH??NG BAN' : ''}
              />
            </Grid>
            {/* <Grid item xs={6}>
              <CustomDatePicker
                invalidDateMessage="Vui l??ng nh???p ng??y ngh???"
                label={name2Title.date}
                value={localData.date || ''}
                onChange={e => handleInputChange(e, 'date')}
                name="date"
                checkedShowForm={localCheckShowForm && localCheckShowForm.date}
                required={localCheckRequired && localCheckRequired.date}
                error={localMessages && localMessages.date}
                helperText={localMessages && localMessages.date}
              />
            </Grid> */}
            <Grid item md={12}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                  <div style={{ display: 'flex', marginTop: 20 }}>
                    <DateTimePicker
                      inputVariant="outlined"
                      format="DD/MM/YYYY HH:mm"
                      // error={!addWorkingSchedule.date}
                      // helperText={addWorkingSchedule.date ? null : 'Kh??ng ???????c b??? tr???ng'}
                      label={"Th???i gian b???t ?????u"}
                      onChange={e => handleInputChange(e, 'fromDate')}
                      value={localData.fromDate}
                      name="fromDate"
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      // keyboard
                      style={{ paddingRight: 10 }}
                    />
                    <DateTimePicker
                      inputVariant="outlined"
                      format="DD/MM/YYYY HH:mm"
                      // error={!addWorkingSchedule.timeEnd}
                      // helperText={addWorkingSchedule.timeEnd ? null : 'Kh??ng ???????c b??? tr???ng'}
                      label={"Th???i gian k???t th??c"}
                      value={localData.toDate}
                      name="timeEnd"
                      margin="dense"
                      variant="outlined"
                      onChange={e => handleInputChange(e, 'toDate')}
                      fullWidth
                      // keyboard
                      style={{ paddingLeft: 10 }}
                    />
                  </div>
                </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={6}>
              <CustomInputBase
                select
                label={name2Title['type.title']}
                value={getSelectedValue(localData.type)}
                onChange={e => handleChange(e, 'type.title')}
                name="type"
                checkedShowForm={localCheckShowForm && localCheckShowForm['type.title']}
                required={localCheckRequired && localCheckRequired['type.title']}
                error={localMessages && localMessages['type.title']}
                helperText={localMessages && localMessages['type.title']}
              >
                {Array.isArray(vacationMode) && vacationMode.length && vacationMode.map(item => <MenuItem value={item}>{item.title}</MenuItem>)}
              </CustomInputBase>
            </Grid>
            <Grid item xs={12}>
              <CustomInputBase
                label={name2Title.reason}
                value={localData.reason}
                onChange={e =>handleChange(e, 'reason')}
                name="reason"
                checkedShowForm={localCheckShowForm && localCheckShowForm.reason}
                required={localCheckRequired && localCheckRequired.reason}
                error={localMessages && localMessages.reason}
                helperText={localMessages && localMessages.reason}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <CustomGroupInputField code="TakeLeave" columnPerRow={2} value={localData.others} onChange={handleOtherDataChange} />
            </Grid> */}
          </Grid>
        </DialogContent>
        {/* <DialogActions>
          <Grid container spacing={8} justify="flex-end">
            <Grid item>
              <CustomButton disabled={!localData.hrmEmployeeId || !localData.type} varian="outlined" color="primary" onClick={handleSave}>
                L??u
              </CustomButton>
            </Grid>
            <Grid item>
              <CustomButton varian="outlined" color="secondary" onClick={e => onClose()}>
                H???Y
              </CustomButton>
            </Grid>
          </Grid>
        </DialogActions> */}
        <DialogActions>
          <Grid item xs={12}>
            <Grid container spacing={8} justify="flex-end">
              <Grid item>
                <CustomButton
                  color="primary"
                  onClick={e => {
                    if (Object.keys(localMessages).length === 0) {
                      handleSave();
                    } else {
                      onChangeSnackbar({ status: true, message: 'Th??m m???i th???t b???i!', variant: 'error' });
                    }
                  }}
                  varian="outlined"
                >
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
      </Dialog>
    </React.Fragment>
  );
}

export default compose(memo)(AddTakeLeaveManager);
