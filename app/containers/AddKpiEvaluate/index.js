/**
 *
 * AddKpiEvaluate
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { LabelImportant, Close } from '@material-ui/icons';
import { Radio, FormControlLabel, RadioGroup, Button, AppBar, Toolbar, IconButton } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Buttons from 'components/CustomButtons/Button';
import { injectIntl } from 'react-intl';
import './style.scss'
import makeSelectAddKpiEvaluate from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import CustomAppBar from 'components/CustomAppBar';
import { TextField, Typography, Paper, Grid, AsyncAutocomplete } from '../../components/LifetekUi';
import { API_USERS, API_CRITERIA } from '../../config/urlConfig';
import { mergeData, postData, getDefault, getCurrent, putData } from './actions';
import CustomDatePicker from '../../components/CustomDatePicker';
import moment from 'moment'
import { changeSnackbar } from '../../containers/Dashboard/actions';

/* eslint-disable react/prefer-stateless-function */
export class AddKpiEvaluate extends React.Component {
  componentDidMount() {
    const id = this.props.match.params.id;
    if (id === 'add') this.props.getDefault();
    else this.props.getCurrent(id);
  }

  handleChangeButton(tab) {
    this.props.mergeData({ tab });
  }

  render() {
    const { addKpiEvaluate, intl } = this.props;
    const { tab } = addKpiEvaluate;
    const BT = props => (
      <Buttons onClick={() => this.handleChangeButton(props.tab)} {...props} color={props.tab === tab ? 'gradient' : ''} round right>
        {props.children}
      </Buttons>
    );
    const id = this.props.match.params.id
    return (
      <div>
        {/* <AppBar className='HearderappBarKpiEvaluate'>
        <Toolbar>
          <IconButton
            // className={id !== 'add' ? '' : ''}
            className='BTNKpiEvaluate'
            color="inherit"
            variant="contained"
            onClick={() => this.props.history.goBack()}
            aria-label="Close"
          >
            <Close />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
            {id !== 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'C???p nh???t' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Th??m M???i' })}`}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            type="submit"
            onClick={this.onSaveData}
          >
            {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'L??u' })}
          </Button>
        </Toolbar>
      </AppBar> */}
        <CustomAppBar
          className='HearderappBarKpiEvaluate'
          title={
            id !== 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'C???p nh???t' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Th??m M???i' })}`
          }
          onGoBack={() => this.props.history.goBack()}
          onSubmit={this.onSaveData}
        ></CustomAppBar>
        <Helmet>
          <title>B???n ????nh gi??</title>
          <meta name="description" content="Description of AddKpiEvaluate" />
        </Helmet>
        {/* <Paper style={{ marginBottom: 20, padding: '0px 16px' }}>
          {this.props.id ? null : (
            <Breadcrumbs aria-label="Breadcrumb">
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
                Dashboard
              </Link>
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/Kpi/manage">
                Danh s??ch ????nh gi??
              </Link>
              <Typography color="textPrimary">Quy tr??nh ????nh gi??</Typography>
            </Breadcrumbs>
          )}
        </Paper> */}
        <Paper>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LabelImportant color="primary" fontSize="large" />
            <Typography variant="h6">Quy tr??nh b???n ????nh gi??</Typography>
          </div>
          <Grid md={10} style={{ display: 'flex', justifyContent: 'space-around', marginTop: 20 }}>
            <BT tab={1} style={{ width: 250 }}>
              1. Ch???n nh??n vi??n
            </BT>
            <BT tab={2} style={{ width: 250 }}>
              2. Ch???n m???u ????nh gi??
            </BT>
            <BT tab={3} style={{ width: 250 }}>
              3. Ch???n quy tr??nh ????nh gi??
            </BT>
            <BT tab={4} style={{ width: 250 }}>
              4. Th???i gian t???o v?? ????nh gi??
            </BT>
            <BT tab={5} style={{ width: 250 }}>
              5. Ho??n th??nh
            </BT>
          </Grid>
          <Grid item md={10}>
            {tab === 1 ? (
              <div style={{ width: '30%' }}>
                <AsyncAutocomplete
                  name="Ch???n..."
                  label="Nh??n vi??n"
                  onChange={value => this.props.mergeData({ employee: value })}
                  url={API_USERS}
                  value={addKpiEvaluate.employee}
                  isMulti
                />
              </div>
            ) : null}
            {tab === 2 ? (
              <div style={{ width: '30%' }}>
                <AsyncAutocomplete
                  name="Ch???n..."
                  label="Lo???i ????nh gi??"
                  onChange={value => this.props.mergeData({ processType: value })}
                  url={`${API_CRITERIA}/processType`}
                  value={addKpiEvaluate.processType}
                />
              </div>
            ) : null}
            {tab === 3 ? (
              <div>
                <div style={{ width: '30%' }}>
                  <AsyncAutocomplete
                    name="Ch???n..."
                    label="Quy tr??nh ????nh gi??"
                    onChange={value => this.props.mergeData({ process: value })}
                    url={`${API_CRITERIA}/process`}
                    value={addKpiEvaluate.process}
                  />
                </div>
                <Typography variant="subtitle2">Th??ng tin quy tr??nh ????nh gi??</Typography>
                {addKpiEvaluate.process === '' ? (
                  <p style={{ color: 'red' }}>Ch??a ch???n quy tr??nh ????nh gi??</p>
                ) : (
                  <div>
                    <Typography>T??n quy tr??nh: {addKpiEvaluate.process.name}</Typography>
                    <Typography>M?? quy tr??nh: {addKpiEvaluate.process.code}</Typography>
                  </div>
                )}
              </div>
            ) : null}
            {tab === 4 ? (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    style={{
                      marginRight: 250,
                    }}
                  >
                    Giai ??o???n
                  </Typography>
                  <RadioGroup aria-label="gender" name="gender1" value={addKpiEvaluate.time} onChange={this.handleChangeTime}>
                    <FormControlLabel value={1} control={<Radio />} label="N??m tr?????c" />
                    <FormControlLabel value={2} control={<Radio />} label="N??m nay" />
                  </RadioGroup>
                </div>
                <Typography align="center" variant="subtitle1">
                  T??y ch???n
                </Typography>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    style={{
                      marginRight: 250,
                    }}
                  >
                    T??? ng??y
                  </Typography>
                  {/* <TextField
                    validators={['required']}
                    errorMessages={['Kh??ng ???????c b??? tr???ng']}
                    required
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    label="T??? ng??y"
                    value={addKpiEvaluate.startDate}
                    name="startDate"
                    onChange={e => this.props.mergeData({ startDate: e.target.value })}
                  /> */}
                  <CustomDatePicker
                    value={addKpiEvaluate.startDate ? moment(addKpiEvaluate.startDate, "YYYY-MM-DD") : null}
                    onChange={e => {
                      this.props.mergeData({ startDate: e ? moment(e) : null })
                    }}
                    label="T??? ng??y"
                    helperText={addKpiEvaluate.startDate ? null : 'T??? ng??y kh??ng ???????c b??? tr???ng'}
                    error={!addKpiEvaluate.startDate}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    style={{
                      marginRight: 250,
                    }}
                  >
                    ?????n ng??y
                  </Typography>
                  {/* <TextField
                    validators={['required']}
                    errorMessages={['Kh??ng ???????c b??? tr???ng']}
                    required
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    label="T??? ng??y"
                    value={addKpiEvaluate.endDate}
                    name="endDate"
                    onChange={e => this.props.mergeData({ endDate: e.target.value })}
                  /> */}
                  <CustomDatePicker
                    value={addKpiEvaluate.endDate ? moment(addKpiEvaluate.endDate, "YYYY-MM-DD") : null}
                    onChange={e => {
                      this.props.mergeData({ endDate: e ? moment(e) : null })
                    }}
                    label="?????n ng??y"
                    helperText={addKpiEvaluate.endDate ? null : '?????n ng??y kh??ng ???????c b??? tr???ng'}
                    error={!addKpiEvaluate.endDate}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    style={{
                      marginRight: 150,
                    }}
                  >
                    H???n ho??n th??nh ????nh gi??
                  </Typography>
                  {/* <TextField
                    validators={['required']}
                    errorMessages={['Kh??ng ???????c b??? tr???ng']}
                    required
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    value={addKpiEvaluate.finishDate}
                    name="finishDate"
                    onChange={e => this.props.mergeData({ finishDate: e.target.value })}
                  /> */}
                  <CustomDatePicker
                    value={addKpiEvaluate.finishDate ? moment(addKpiEvaluate.finishDate, "YYYY-MM-DD") : null}
                    onChange={e => {
                      this.props.mergeData({ finishDate: e ? moment(e) : null })
                    }}
                    label="H???n ho??n th??nh ????nh gi??"
                    helperText={addKpiEvaluate.finishDate ? null : ''}
                    error={false}
                  />
                </div>
              </div>
            ) : null}
            {tab === 5 ? (
              <div>
                <div style={{ display: 'flex' }}>
                  <div style={{ marginRight: 280 }}>
                    <Typography variant="subtitle2">Ch???n nh??n vi??n</Typography>
                    <Typography variant="subtitle2">Ch???n m???u ????nh gi??</Typography>
                    <Typography variant="subtitle2">Ch???n quy tr??nh ????nh gi??</Typography>
                    <Typography variant="subtitle2">Th???i gian t???o v?? ????nh gi??</Typography>
                  </div>
                  <div>
                    <Typography>T???ng s??? nh??n vi??n ???????c ch???n: {addKpiEvaluate.employee.length}</Typography>
                    <Typography>{addKpiEvaluate.processType.name}</Typography>
                    <Typography>{addKpiEvaluate.process.name}</Typography>
                    <Typography>
                      Th???i gian ????nh gi??: T??? {new Date(addKpiEvaluate.startDate).toISOString().substring(0, 10)} {` ?????n `}
                      {addKpiEvaluate.endDate !== '' ? new Date(addKpiEvaluate.endDate).toISOString().substring(0, 10) : null}
                      <p>
                        H???n ho??n th??nh:
                        {` `}
                        {addKpiEvaluate.finishDate !== '' ? new Date(addKpiEvaluate.finishDate).toISOString().substring(0, 10) : null}
                      </p>
                    </Typography>
                  </div>
                </div>
                {/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="outlined" color="primary" style={{ width: 100 }} onClick={this.onSaveData}>
                    L??u
                  </Button>
                </div> */}
              </div>
            ) : null}
          </Grid>
        </Paper>
      </div>
    );
  }

  onSaveData = () => {
    const id = this.props.match.params.id;
    const addKpiEvaluate = this.props.addKpiEvaluate;
    const startDate = addKpiEvaluate.startDate
    const endDate = addKpiEvaluate.endDate
    const finishDate = addKpiEvaluate.finishDate


    if (!startDate) {
      return this.props.onChangeSnackbar && this.props.onChangeSnackbar({ status: true, message: 'Vui l??ng ??i???n t??? ng??y!', variant: 'error' });
    }
    else if (!endDate) {
      return this.props.onChangeSnackbar && this.props.onChangeSnackbar({ status: true, message: 'Vui l??ng ??i???n ?????n ng??y!', variant: 'error' });
    }
    else if (!finishDate) {
      return this.props.onChangeSnackbar && this.props.onChangeSnackbar({ status: true, message: 'Vui l??ng ??i???n h???n ho??n th??nh ????nh gi??!', variant: 'error' });
    }
    const data = {
      employee: addKpiEvaluate.employee,
      processType: addKpiEvaluate.processType,
      process: addKpiEvaluate.process,
      time: addKpiEvaluate.time,
      startDate: addKpiEvaluate.startDate ? moment(addKpiEvaluate.startDate, "DD-MM-YYYY").format("DD-MM-YYYY") : null,
      endDate: addKpiEvaluate.endDate ? moment(addKpiEvaluate.endDate, "DD-MM-YYYY").format("DD-MM-YYYY") : null,
      finishDate: addKpiEvaluate.finishDate ? moment(addKpiEvaluate.finishDate, "DD-MM-YYYY").format("DD-MM-YYYY") : null,

    };

    if (id === 'add') {
      this.props.postData(data);
    } else {
      this.props.putData(id, data);
    }
    this.props.history.goBack();
  };

  handleChangeTime = e => {
    this.props.mergeData({ time: e.target.value * 1 });
  };
}

AddKpiEvaluate.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addKpiEvaluate: makeSelectAddKpiEvaluate(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    postData: data => dispatch(postData(data)),
    getDefault: () => dispatch(getDefault()),
    getCurrent: id => dispatch(getCurrent(id)),
    putData: (id, data) => dispatch(putData(id, data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addKpiEvaluate', reducer });
const withSaga = injectSaga({ key: 'addKpiEvaluate', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(AddKpiEvaluate);
