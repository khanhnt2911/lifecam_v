/**
 *
 * AddRecruitmentManagement
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, TextField } from 'components/LifetekUi';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import { MenuItem, AppBar, Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import CustomAppBar from 'components/CustomAppBar';
import { serialize } from 'helper';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { API_LT_ACCOUNT } from '../../config/urlConfig';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddLtAccount from './selectors';
import reducer from './reducer';
import saga from './saga';
import ChangePassWord from './components/ChangePassWord';
import { createAccountRequest, updateAccountRequest, updatePasswordRequest, reloadAccountPage, mergeAccountRequest } from './actions';
import { viewConfigCheckForm, viewConfigCheckRequired, viewConfigHandleOnChange } from '../../utils/common';
import dot from 'dot-object';
import { changeSnackbar } from '../Dashboard/actions';
/* eslint-disable react/prefer-stateless-function */
function AddLtAccountPage(props) {
  const code = 'LtAccount';
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [error, setError] = useState(false);
  const [localMessages, setLocalMessages] = useState({});
  const [localState, setLocalState] = useState({
    moduleCode: '',
    username: '',
    password: '',
    accountPhone: '',
    accountName: '',
    accountEmail: '',
    accountStatus: '',
    others: {},
   
  });
  const [state, setState] = useState({
    crmSource: JSON.parse(localStorage.getItem('crmSource')),
    othersName: JSON.parse(localStorage.getItem('viewConfig'))
      .find(item => item.code === 'LtAccount')
      .listDisplay.type.fields.type.others.map(item => ({ ...item, name: item.name.substring(7) })),
  })
  const [openModal, setOpenModal] = useState(false);
  const menu = localStorage.getItem('viewConfig');
  const { createAccountRequestSuccess, updateAccountRequestSuccess, loading, updatePasswordRequestSuccess } = props.accountRequest;

  const id = props.history.valueTab;
  const requestURL = API_LT_ACCOUNT;

  useEffect(() => {
    setLocalCheckRequired(viewConfigCheckRequired(code, 'required'));
    setLocalCheckShowForm(viewConfigCheckRequired(code, 'showForm'));
    setLocalMessages(viewConfigCheckForm(code, localState));
  }, []);
  useEffect(
    () => {
      let messages = viewConfigCheckForm(code, localState);
      setLocalMessages(messages);
      if (localState.username && validateCharacters(localState.username)) {
        messages = { ...messages, username: 'T??N ????NG NH???P kh??ng ???????c ch???a kho???ng tr???ng v?? k?? t??? c?? d???u' };
      }
      setLocalMessages(messages);

      return () => {
        messages;
      };
    },
    [localState],
  );
  useEffect(
    () => {
      if (id !== 'add')
        fetch(`${requestURL}/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            setLocalState(data);
          });
    },
    [id],
  );

  useEffect(
    () => {
      if (loading) {
        props.reloadAccountPage();
        props.history.goBack();
      }
    },
    [loading],
  );

  useEffect(
    () => {
      if (updatePasswordRequestSuccess === true) {
        setOpenModal(false);
      }
    },
    [updatePasswordRequestSuccess],
  );

  const validateCharacters = value => {
    const regex = /^[a-zA-Z??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????\s\W|_]+$/i;
    const data = regex.test(value) && /[^a-zA-Z]/.test(value);
    console.log(data, value);
    if (data === true) {
      setError(true);
    } else setError(false);
    return data;
  };
  const handleChange = (e, fieldName) => {
    const messages = viewConfigHandleOnChange('LtAccount', localMessages, fieldName, e.target.value);
    setLocalState({
      ...localState,
      [e.target.name]: e.target.value,
    });
    setLocalMessages(messages);
  };
  const setOthers = (name, value) => {
    const { others } = localState;
    const newOthers = { ...others };
    newOthers[name] = value;
    setLocalState({...localState,  others: newOthers });
  };

  const handleOthers = () => (
    <React.Fragment>
      { state.othersName.map(item => {
        switch (item.type) {
          case 'text':
          case 'number':
          case 'date':
            return (
              <TextField
                onChange={e => setOthers(item.name, e.target.value)}
                label={item.title}
                fullWidth
                type={item.type}
                defaultValue=""
                title={item.title}
                value={localState.others ? localState.others[item.name] : ''}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            );
          default:
            return (
              <TextField
                value={localState.others ? localState.others[item.name] : localState.others}
                onChange={e => setOthers(item.name, e.target.value)}
                label={item.title}
                fullWidth
                // select
                InputLabelProps={{
                  shrink: true,
                }}
              >
                {state.crmSource.find(el => el._id === item.type)
                  ? state.crmSource.find(el => el._id === item.type).data.map(ele => <MenuItem value={ele.value}>{ele.title}</MenuItem>)
                  : null}
              </TextField>
            );
        }
      })}
    </React.Fragment>
  );
  const onSave = () => {
    const body = {
      ...localState,
    };

    const messages = viewConfigCheckForm('LtAccount', dot.dot(body));
    if (Object.keys(messages).length === 0 && !error) {
      if (body._id) {
        props.onUpdateAccountRequest(body);
      } else {
        props.onCreateAccountRequest(body);
      }
    } else {
      props.onChangeSnackbar({ status: true, message: 'Th??m m???i d??? li???u th???t b???i', variant: 'error' });
    }
  };
  const handleSave = item => {
    if (item.password !== item.newPassword) {
      alert('Nh??p m???t kh???u ph???i tr??ng nhau');
    } else {
      const data = {
        ...item,
        id: localState._id,
      };

      props.onUpdatePasswordRequest(data);
    }
  };
  const onChangePass = () => {
    setOpenModal(true);
  };
  const handleCloseDialog = () => {
    setOpenModal(false);
  };
  return (
    <>
      <CustomAppBar
        className
        title={id === 'add' ? `Th??m m???i t??i kho???n` : `C???p nh???t t??i kho???n`}
        onGoBack={() => {
          props.history.goBack();
        }}
        onSubmit={onSave}
        onChangePass={onChangePass}
        id={id}
      />
      <Grid container>
        <Typography variant="h5" color="primary">
          ??i???n th??ng tin
        </Typography>
      </Grid>

      <Grid container spacing={8}>
        <Grid item xs={4}>
          <TextField
            value={localState.moduleCode}
            fullWidth
            name="moduleCode"
            label="ModuleCode"
            select
            variant="outlined"
            margin="dense"
            onChange={e => handleChange(e, 'moduleCode')}
            InputLabelProps={{
              shrink: true,
            }}
            checkedShowForm={localCheckShowForm && localCheckShowForm.moduleCode}
            required={localCheckRequired && localCheckRequired.moduleCode}
            error={localMessages && localMessages.moduleCode}
            helperText={localMessages && localMessages.moduleCode}
          >
            <MenuItem value={null}>--CH???N--</MenuItem>
            <MenuItem value={'Customer'}>Kh??ch h??ng</MenuItem>
            <MenuItem value={'Supplier'}>Nh?? cung c???p</MenuItem>
            <MenuItem value={'Contract'}>H???p ?????ng</MenuItem>
            {/* <MenuItem value={3}>?????i t??c</MenuItem> */}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          {/* {
             console.log(localState.username)
           } */}
          <CustomInputBase
            label={'T??i kho???n'}
            value={localState.username}
            name="username"
            required
            onChange={e => handleChange(e, 'username')}
            error={localMessages && localMessages.username}
            helperText={localMessages && localMessages.username}
          />
        </Grid>
        {id === 'add' ? (
          <Grid item xs={4}>
            <TextField
              label="M???t kh???u"
              value={localState.password}
              name="password"
              onChange={e => handleChange(e, 'password')}
              variant="outlined"
              type="password"
              InputLabelProps={{
                shrink: true,
              }}
              margin="dense"
              required
              fullWidth
              checkedShowForm={localCheckShowForm && localCheckShowForm.password}
              // required={localCheckRequired && localCheckRequired.password}
              error={(localMessages && localMessages.password) || !localState.password}
              helperText={(localMessages && localMessages.password) || !localState.password ? 'Kh??ng ???????c ????? tr???ng m???t kh???u' : null}
            />
          </Grid>
        ) : (
          //   <Grid item xs={4}>
          //         <CustomInputBase label={'M???t kh???u'} value={localState.password ? localState.password : null} name="password" onChange={handleChange} />
          //     </Grid>
          <> </>
        )}

        <Grid item xs={4}>
          <CustomInputBase
            label={'S??? ??i???n tho???i'}
            value={localState.accountPhone}
            name="accountPhone"
            onChange={e => handleChange(e, 'accountPhone')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.accountPhone}
            required={localCheckRequired && localCheckRequired.accountPhone}
            error={localMessages && localMessages.accountPhone}
            helperText={localMessages && localMessages.accountPhone}
          />
        </Grid>
        
        
        {/* <CustomGroupInputField
          code="LtAccount"
          columnPerRow={3}
          value={localState.others}
          onChange={e => handleChange(e, 'others')}
          noGrid={true}
        /> */}
        <Grid item xs={4}>
          <CustomInputBase
            label={'T??n ng?????i d??ng'}
            value={localState.accountName}
            name="accountName"
            onChange={e => handleChange(e, 'accountName')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.accountName}
            required={localCheckRequired && localCheckRequired.accountName}
            error={localMessages && localMessages.accountName}
            helperText={localMessages && localMessages.accountName}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={'Email'}
            value={localState.accountEmail}
            name="accountEmail"
            onChange={e => handleChange(e, 'accountEmail')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.accountEmail}
            required={localCheckRequired && localCheckRequired.accountEmail}
            error={localMessages && localMessages.accountEmail}
            helperText={localMessages && localMessages.accountEmail}
          />
        </Grid>
        {/* <Grid item xs={4}>
                     <CustomInputBase label={'Tr???ng th??i t??i kho???n'} value={localState.accountStatus ? localState.accountStatus : null} name="accountStatus" onChange={handleChange} />
                 </Grid> */}
        <Grid item xs={4}>
          <TextField
            value={localState.accountStatus}
            fullWidth
            name="accountStatus"
            label="Tr???ng th??i t??i kho???n"
            select
            variant="outlined"
            margin="dense"
            onChange={e => handleChange(e, 'accountStatus')}
            InputLabelProps={{
              shrink: true,
            }}
            checkedShowForm={localCheckShowForm && localCheckShowForm.accountStatus}
            required={localCheckRequired && localCheckRequired.accountStatus}
            error={localMessages && localMessages.accountStatus}
            helperText={localMessages && localMessages.accountStatus}
          >
            <MenuItem value={0}>--CH???N--</MenuItem>
            <MenuItem value={1}>Ho???t ?????ng</MenuItem>
            <MenuItem value={2}>Kh??a ho???t ?????ng</MenuItem>
            {/* <MenuItem value={3}>?????i t??c</MenuItem> */}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          {handleOthers()}
        </Grid>
        {/* <Grid item xs={4}>
                     <CustomInputBase label={'Tr???ng th??i ph?? duy???t'} value={localState.state} name="state" onChange={handleChange} />
                 </Grid> */}
      </Grid>
      <Dialog fullWidth maxWidth={'md'} open={openModal} onClose={handleCloseDialog} disableEnforceFocus>
        <DialogTitle>?????i m???t kh???u</DialogTitle>
        <DialogContent>
          <ChangePassWord onSave={handleSave} onClose={handleCloseDialog} passwordData={localState} />
        </DialogContent>
      </Dialog>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  accountRequest: makeSelectAddLtAccount(),
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onCreateAccountRequest: data => dispatch(createAccountRequest(data)),
    onUpdateAccountRequest: data => dispatch(updateAccountRequest(data)),
    onUpdatePasswordRequest: data => dispatch(updatePasswordRequest(data)),
    reloadAccountPage: () => dispatch(reloadAccountPage()),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'accountRequest', reducer });
const withSaga = injectSaga({ key: 'accountRequest', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(AddLtAccountPage);
