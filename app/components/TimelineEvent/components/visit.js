import React from 'react';
import { Grid, TextField, Button, InputAdornment, IconButton, Checkbox, MenuItem } from '@material-ui/core';
import { Delete, CloudDownload } from '@material-ui/icons';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { DateTimePicker, TimePicker } from 'material-ui-pickers';
import moment from 'moment';
import { API_USERS, UPLOAD_IMG_SINGLE } from '../../../config/urlConfig';
import { serialize } from '../../../utils/common';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { makeSelectProfile } from '../../../containers/Dashboard/selectors';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { AsyncAutocomplete } from '../../LifetekUi';

const promiseOptions = (searchString, putBack) => {
  const param = {
    limit: '10',
    skip: '0',
  };
  if (searchString !== '') {
    param.filter = {
      name: {
        $regex: searchString,
        $options: 'gi',
      },
    };
  }
  const token = localStorage.getItem('token');
  axios
    .get(`${API_USERS}?${serialize(param)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      const convertedData = [];
      response.data.data.map(item => convertedData.push({ ...item, ...{ label: item.name, value: item._id } }));
      putBack(convertedData);
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.log(err);
    });
};
const customStyles = {
  menu: base => ({
    ...base,
    backgroundColor: 'white',
    zIndex: '2!important',
  }),
  menuList: base => ({
    ...base,
    backgroundColor: 'white',
    zIndex: '2!important',
  }),
};

export class Visit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visit: {
        businessName: '',
        address: '',
        people: [],
        pointOfContact: '',
        purpose: '',
        file: undefined,
        result: '',
        isFinished: false,
        isImportant: false,
        timeNotification: undefined,
        startTime: new Date(),
        endTime: new Date(),
      },
      reminderBefore: {
        enable: false,
        value: 0,
        unit: 'minutes',
      },
    };
  }

  componentWillReceiveProps(props) {
    if (props.visitDetail) {
      this.state.visit = props.visitDetail;
      this.state.visit.people = this.state.visit.people.map(person => ({
        ...person,
        ...{ label: person.name, value: person.employeeId },
      }));
      if (props.visitDetail.timeNotification) {
        this.state.reminderBefore.enable = true;
        const startTime = moment(props.visitDetail.startTime);
        this.state.reminderBefore.value = moment.duration(startTime.diff(moment(props.visitDetail.timeNotification))).asMinutes();
        this.state.reminderBefore.unit = 'minutes';
      }
    }
    this.setState({ visit: { ...this.state.visit, people: [this.props.profile] } });
  }

  componentDidMount() {
    this.setState({ visit: { ...this.state.visit, people: [this.props.profile] } });
  }

  handleChangeSelect = (selectedOption, key) => {
    const { visit } = this.state;
    visit[key] = selectedOption;
    this.setState({ visit });
  };
  handleCreateVisit = () => {
    const { visit, reminderBefore } = this.state;
    const newVisit = Object.assign({}, visit);
    newVisit.link = `${this.props.path}/${this.props.generalData._id}`;
    newVisit.from = this.props.generalData._id;
    newVisit.people = newVisit.people.map(item => ({
      name: item.name,
      employeeId: item._id,
    }));
    newVisit.startTime = newVisit.startTime;
    newVisit.endTime = newVisit.endTime;

    if (reminderBefore.enable) {
      newVisit.timeNotification = moment(visit.startTime).subtract(reminderBefore.value, reminderBefore.unit);
    }
    if (visit.businessName !== undefined && visit.businessName.trim() === '') {
      this.props.onChangeSnackbar({ status: true, message: 'T??n doanh nghi???p kh??ng ???????c ????? tr???ng!', variant: 'error' });
      return;
    }
    if (newVisit.address === '') {
      this.props.onChangeSnackbar({ status: true, message: '?????a ??i???m kh??ng ???????c ????? tr???ng!', variant: 'error' });
      return;
    }
    if (visit.startTime >= visit.endTime) {
      this.props.onChangeSnackbar({ status: true, message: 'Ng??y b???t ?????u l???n h??n ho???c b???ng ng??y k???t th??c!', variant: 'error' });
      return;
    }
    if (this.meetingFile) {
      const formData = new FormData();
      formData.append('file', this.meetingFile);
      fetch(UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {},
        body: formData,
      })
        .then(response => response.json())
        .then(success => {
          newVisit.file = success.url;
          this.props.onCreateVisit(newVisit, this.props.generalData._id);
        })
        .catch(error => {
          // eslint-disable-next-line no-alert
          alert(error);
        });
    } else {
      this.props.onCreateVisit(newVisit, this.props.generalData._id);
    }
    this.clearInput();
  };

  clearInput = () => {
    this.setState({
      visit: {
        businessName: '',
        address: '',
        people: [],
        pointOfContact: '',
        purpose: '',
        file: undefined,
        result: '',
        isFinished: false,
        isImportant: false,
        isRemindBefore: false,
        timeNotification: undefined,
        startTime: new Date(),
        endTime: new Date(),
      },
      reminderBefore: {
        enable: false,
        value: 0,
        unit: 'minutes',
      },
    });
  };

  render() {
    const { visit, reminderBefore } = this.state;
    return (
      <div style={{ marginBottom: 100 }}>
        <Grid container>
          <Grid item sm={12} lg={6} className="px-2 my-1">
            <DateTimePicker
              fullWidth
              disablePast
              keyboard
              variant="outlined"
              disableOpenOnEnter
              keyboardIcon={<i className="far fa-clock fa-xs" />}
              label="Th???i gian b???t ?????u"
              value={visit.startTime}
              onChange={event => {
                const { visit } = this.state;
                if (parseInt(moment(visit.endTime).diff(event, 'minutes')) < 0) {
                  this.props.onChangeSnackbar({ status: true, message: 'Th???i gian k???t th??c kh??ng ???????c nh??? h??n b???t ?????u!', variant: 'error' });
                } else {
                  visit.startTime = event;
                }
                this.setState({ visit });
              }}
              format="MM/DD/YYYY HH:mm"
            />
            
          </Grid>
          <Grid item sm={12} lg={6} className="px-2 my-1">
            <DateTimePicker
              fullWidth
              disablePast
              keyboard
              variant="outlined"
              disableOpenOnEnter
              keyboardIcon={<i className="far fa-clock fa-xs" />}
              label="Th???i gian k???t th??c"
              onChange={event => {
                const { visit } = this.state;
                if (parseInt(event.diff(moment(event), 'minutes')) < 0) {
                  this.props.onChangeSnackbar({ status: true, message: 'Th???i gian k???t th??c kh??ng ???????c nh??? h??n th???i gian b???t ?????u!', variant: 'error' });
                } else {
                  visit.endTime = event;
                }
                this.setState({ visit });
              }}
              value={visit.endTime}
              format="MM/DD/YYYY HH:mm"
            />
          </Grid>
          <Grid item sm={4} className="px-2 my-1">
            <Checkbox
              checked={visit.isFinished}
              onChange={event => {
                visit.isFinished = event.target.checked;
                this.setState({ visit });
              }}
              value="isFinished"
            />
            <span> ???? ho??n th??nh </span>
          </Grid>
          <Grid item sm={4} className="px-2 my-1">
            <Checkbox
              checked={visit.isImportant}
              onChange={event => {
                visit.isImportant = event.target.checked;
                this.setState({ visit });
              }}
              value="isImportant"
              label="Quan tr???ng"
            />
            <span> Quan tr???ng </span>
          </Grid>
          <Grid item sm={4} className="px-2 my-1">
            <Checkbox
              checked={reminderBefore.enable}
              onChange={event => {
                reminderBefore.enable = event.target.checked;
                this.setState({ reminderBefore });
              }}
              value="isRemindBefore"
              label="Nh???c tr?????c"
            />
            <span> Nh???c tr?????c </span>
          </Grid>
          {reminderBefore.enable ? (
            <Grid item sm={12} lg={12} className="px-2 my-1">
              <p>Nh???c nh??? trong: </p>
            </Grid>
          ) : (
            ''
          )}

          {reminderBefore.enable ? (
            <Grid item sm={12} lg={6} className="px-2 my-1">
              <TextField
                variant="outlined"
                fullWidth
                type="number"
                label="Th???i gian"
                value={reminderBefore.value}
                onChange={event => {
                  reminderBefore.value = event.target.value;
                  this.setState({ reminderBefore });
                }}
              />
            </Grid>
          ) : (
            ''
          )}
          {reminderBefore.enable ? (
            <Grid item sm={12} lg={6} className="px-2 my-1">
              <TextField
                variant="outlined"
                fullWidth
                select
                label="????n v???"
                value={reminderBefore.unit}
                onChange={event => {
                  reminderBefore.unit = event.target.value;
                  this.setState({ reminderBefore });
                }}
              >
                <MenuItem value="minutes">Ph??t</MenuItem>
                <MenuItem value="hours">Gi???</MenuItem>
              </TextField>
            </Grid>
          ) : (
            ''
          )}
          <Grid item sm={12} lg={6} className="px-2 my-1">
            <TextField
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              fullWidth
              label="T??n doanh nghi???p"
              value={visit.businessName}
              onChange={event => {
                visit.businessName = event.target.value;
                this.setState({ visit });
              }}
              required
              error={!visit.businessName}
              helperText={!visit.businessName ? 'Kh??ng ???????c b??? tr???ng T??N DOANH NGHI???P' : null}
            />
          </Grid>
          <Grid item sm={12} lg={6} className="px-2 my-1">
            <TextField
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              fullWidth
              label="?????a ??i???m"
              value={visit.address}
              onChange={event => {
                visit.address = event.target.value;
                this.setState({ visit });
              }}
              required
              error={!visit.address}
              helperText={!visit.address ? 'Kh??ng ???????c b??? tr???ng ?????A ??I???M' : null}
            />
          </Grid>
          <Grid item sm={12} lg={12} className="px-2 my-1">
            {/* {console.log(visit.people,'visit.people')}  */}
            {/* <AsyncSelect
              onChange={selectedOption => {
                this.handleChangeSelect(selectedOption, 'people');
              }}
              placeholder="Ng?????i tham gia"
              styles={customStyles}
              defaultOptions
              value={visit.people}
              isMulti
              loadOptions={(inputValue, callback) => {
                clearTimeout(this.people);
                this.people = setTimeout(() => {
                  promiseOptions(inputValue, callback);
                }, 1000);
              }}
              theme={theme => ({
                ...theme,
                spacing: {
                  ...theme.spacing,
                  controlHeight: '55px',
                },
              })}
            /> */}
            <AsyncAutocomplete
              name="Ch???n..."
              label="Nguoi tham gia"
              onChange={selectedOption => {
                this.handleChangeSelect(selectedOption, 'people');
              }}
              url={`${API_USERS}`}
              value={visit.people}
              isMulti
              placeholder="Ng?????i tham gia"
              // error={localMessages && localMessages.people}
              // helperText={localMessages && localMessages.people}
              // required={checkRequired.people}
              // checkedShowForm={checkShowForm.people}
            />
          </Grid>
          <Grid item sm={12} lg={12} className="px-2 my-1">
            <TextField
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              fullWidth
              label="?????u m???i li??n h???"
              value={visit.pointOfContact}
              onChange={event => {
                visit.pointOfContact = event.target.value;
                this.setState({ visit });
              }}
            />
          </Grid>
          <Grid item sm={12} className="px-2 my-1 ">
            {visit.file !== undefined ? (
              <TextField
                id="outlined-adornment-password"
                variant="outlined"
                label="T???p ????nh k??m"
                value={visit.file}
                fullWidth
                className="my-2"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={() => {
                          window.open(visit.file);
                        }}
                      >
                        <CloudDownload />
                      </IconButton>
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={() => {
                          visit.file = undefined;
                          this.setState({ visit });
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                id="outlined-name"
                label="T???p ????nh k??m"
                className=""
                type="file"
                value={visit.file}
                onChange={event => {
                  const { visit } = this.state;
                  visit.file = event.target.value;
                  this.meetingFile = event.target.files[0];
                  this.setState({ visit });
                }}
                margin="normal"
                variant="outlined"
              />
            )}
          </Grid>
          <Grid item sm={12} lg={12} className="px-2 my-1">
            <TextField
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              label="M???c ????ch"
              value={visit.purpose}
              onChange={event => {
                visit.purpose = event.target.value;
                this.setState({ visit });
              }}
            />
          </Grid>
          <Grid item sm={12} lg={12} className="px-2 my-1">
            <TextField
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              label="K???t qu???"
              value={visit.result}
              onChange={event => {
                visit.result = event.target.value;
                this.setState({ visit });
              }}
            />
          </Grid>
          <Grid item sm={12} className="my-1 text-right ">
            <Button
              onClick={() => {
                this.handleCreateVisit();
              }}
              variant="outlined"
              color="primary"
              className="mx-1"
            >
              L??u
              {/* {this.props.isEditting ? 'Ch???nh s???a l???ch h???p' : 'T???o l???ch h???p'} */}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className="mx-1"
              onClick={() => {
                this.clearInput();
              }}
            >
              Hu???
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
Visit.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});

const withConnect = connect(mapStateToProps);

export default compose(
  injectIntl,
  withConnect,
)(Visit);
