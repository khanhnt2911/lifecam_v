/* eslint-disable no-alert */
import React from 'react';
import { Grid, TextField, Button, InputAdornment, IconButton } from '@material-ui/core';
import { Delete, CloudDownload } from '@material-ui/icons';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { DatePicker, TimePicker } from 'material-ui-pickers';
import moment from 'moment';
import { API_USERS, UPLOAD_IMG_SINGLE } from '../../../config/urlConfig';
import { serialize } from '../../../utils/common';
import { AsyncAutocomplete } from '../../../components/LifetekUi';
import './loading.css';
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

export default class Meeting extends React.Component {
  state = {
    meetingData: {
      date: new Date(),
      timeStart: new Date(),
      timeEnd: new Date(),
      name: '',
      code: '',
      createdBy: null,
      people: [],
      organizer: null,
      content: '',
      result: '',
      address: '',
      from: '',
    },
  };

  componentDidMount() {
    if (this.state.meetingData.createdBy === null) {
      this.state.meetingData.createdBy = {};
      this.state.meetingData.createdBy.label = this.props.profile.name;
      this.state.meetingData.createdBy.value = this.props.profile._id;
    }
    if (this.state.meetingData.people === null) {
      this.state.meetingData.people = {};
      this.state.meetingData.people.name = this.props.profile.name;
      this.state.meetingData.people.employeeId = this.props.profile._id;
    }
  }

  componentWillReceiveProps(props) {
    // if (props.meetingDetail) {
    //   // console.log(props.meetingDetail);
    //   this.state.meetingData = props.meetingDetail;
    //   this.state.meetingData.timeEnd = new Date(this.state.meetingData.timeEnd * 1000);
    //   this.state.meetingData.timeStart = new Date(this.state.meetingData.timeStart * 1000);
    //   this.state.meetingData.createdBy.label = this.state.meetingData.createdBy ? this.state.meetingData.createdBy.name : '';
    //   this.state.meetingData.createdBy.value = this.state.meetingData.createdBy ? this.state.meetingData.createdBy.employeeId : '';
    //   this.state.meetingData.organizer.label = this.state.meetingData.organizer.name;
    //   this.state.meetingData.organizer.value = this.state.meetingData.organizer.employeeId;
    //   this.state.meetingData.people = this.state.meetingData.people.map(person => ({
    //     ...person,
    //     ...{ label: person.name, value: person.employeeId },
    //   }));
    // } else {
    //   this.clearInput();
    // }
  }

  handleChangeSelect = (selectedOption, key) => {
    const { meetingData } = this.state;
    meetingData[key] = selectedOption;
    this.setState({ meetingData });
  };

  handleChangeInput = key => event => {
    const { meetingData } = this.state;
    meetingData[key] = event.target.value;
    this.setState(meetingData);
  };

  handleCreateMeeting = () => {
    const { meetingData } = this.state;
    const newMeeting = Object.assign({}, meetingData);
    if (newMeeting.name.trim() === '') {
      this.props.onChangeSnackbar({ status: true, message: 'Ti??u ????? bu???i h???p kh??ng ???????c ????? tr???ng!', variant: 'error' });
      return;
    }
    if (newMeeting.code.trim() === '') {
      this.props.onChangeSnackbar({ status: true, message: 'M?? bu???i h???p kh??ng ???????c ????? tr???ng!', variant: 'error' });
      return;
    }
    if (newMeeting.address === '') {
      this.props.onChangeSnackbar({ status: true, message: '?????a ??i???m cu???c h???p kh??ng ???????c ????? tr???ng', variant: 'error' });
      return;
    }
    if (meetingData.timeStart >= meetingData.timeEnd) {
      this.props.onChangeSnackbar({ status: true, message: 'Ng??y b???t ?????u l???n h??n ng??y k???t th??c!', variant: 'error' });
      return;
    }
    if (meetingData.organizer === null) {
      this.props.onChangeSnackbar({ status: true, message: 'Ng?????i t??? ch???c kh??ng ???????c tr???ng!', variant: 'error' });
      return;
    }
    newMeeting.link = `${this.props.path}/${this.props.generalData._id}`;
    newMeeting.from = this.props.generalData._id;
    // newMeeting.timeStart = moment(meetingData.timeStart).unix();
    // newMeeting.timeEnd = moment(meetingData.timeEnd).unix();
    newMeeting.timeStart = meetingData.timeStart;
    newMeeting.timeEnd = meetingData.timeEnd;
    newMeeting.createdBy = {
      name: meetingData.createdBy.name || meetingData.createdBy.label,
      employeeId: meetingData.createdBy._id || meetingData.createdBy.value,
    };
    newMeeting.organizer = {
      name: meetingData.organizer.name,
      employeeId: meetingData.organizer._id,
    };
    newMeeting.people = meetingData.people.map(item => ({
      name: item.name,
      employeeId: item._id,
    }));
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
          newMeeting.file = success.url;
          this.props.onCreateMeeting(newMeeting, this.props.generalData._id, clearInput);
        })
        .catch(error => {
          alert(error);
        });
    } else {
      this.props.onCreateMeeting(newMeeting, this.props.generalData._id, this.clearInput);
    }
    this.props.handleClear();
    // this.clearInput();
  };

  clearInput = () => {
    console.log("reset value input calender")
    this.setState({
      meetingData: {
        date: new Date(),
        timeStart: new Date(),
        timeEnd: new Date(),
        name: '',
        code: '',
        createdBy: {
          label: this.props.profile && this.props.profile.name || null,
          value: this.props.profile && this.props.profile._id || null
        },
        people: [],
        organizer: null,
        file: undefined,
        content: '',
        result: '',
        address: '',
        from: '',
      },
    });
  };

  render() {
    const { meetingData } = this.state;

    return (
      <div>
        <Grid container>
          <Grid item sm={12} xl={4} className="my-1">
            <DatePicker
              fullWidth
              variant="outlined"
              keyboard
              className="mr-xl-2  my-0"
              margin="normal"
              label="Ng??y h???p"
              value={meetingData.date}
              onChange={event => {
                const { meetingData } = this.state;
                meetingData.date = event;
                this.setState(meetingData);
              }}
              disablePast
            />
          </Grid>
          <Grid item sm={6} xl={4} className="my-1">
            <TimePicker
              variant="outlined"
              keyboard
              keyboardIcon={<i className="far fa-clock fa-xs" />}
              className="picker mx-xl-2"
              label="Th???i gian b???t ?????u"
              value={meetingData.timeStart}
              onChange={event => {
                const { meetingData } = this.state;
                if (meetingData._id) {
                  meetingData.timeStart = event;
                  this.setState(meetingData);
                } else if ((moment().isBefore(event) && moment().isSame(this.state.meetingData.date, 'day')) || (!moment().isSame(this.state.meetingData.date, 'day'))) {
                  meetingData.timeStart = event;
                  this.setState(meetingData);
                } else {
                  this.props.onChangeSnackbar({ status: true, message: 'Th???i gian b???t ?????u kh??ng ???????c nh??? h??n hi???n t???i!', variant: 'error' });
                }
              }}
              disableOpenOnEnter
            // disablePast
            />
          </Grid>
          <Grid sm={6} xl={4} className="my-1">
            <TimePicker
              variant="outlined"
              keyboard
              className="picker ml-xl-2"
              label="Th???i gian k???t th??c"
              value={meetingData.timeEnd}
              onChange={event => {
                const { meetingData } = this.state;
                if (event <= meetingData.timeStart) {
                  meetingData.timeEnd = meetingData.timeStart;
                  this.props.onChangeSnackbar({ status: true, message: 'Th???i gian k???t th??c kh??ng ???????c nh??? h??n b???t ?????u!', variant: 'error' });
                } else {
                  meetingData.timeEnd = event;
                }
                this.setState(meetingData);
              }}
              disableOpenOnEnter
              // disablePast
              keyboardIcon={<i className="far fa-clock fa-xs" />}
            />
          </Grid>
          <Grid item sm={12} className="my-1">
            <TextField
              fullWidth
              id="outlined-full-width"
              InputLabelProps={{
                shrink: true,
              }}
              label="M?? bu???i h???p"
              className=""
              value={meetingData.code}
              onChange={this.handleChangeInput('code')}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item sm={12} className="my-1">
            <TextField
              fullWidth
              id="outlined-full-width"
              InputLabelProps={{
                shrink: true,
              }}
              label="Ti??u ????? bu???i h???p"
              className=""
              value={meetingData.name}
              onChange={this.handleChangeInput('name')}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item sm={12} className="my-1 ">
            <TextField
              fullWidth
              id="outlined-full-width"
              InputLabelProps={{
                shrink: true,
              }}
              label="?????a ??i???m"
              className=""
              value={meetingData.address}
              onChange={this.handleChangeInput('address')}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid sm="12" className="my-2">
            <AsyncSelect
              onChange={selectedOption => {
                this.handleChangeSelect(selectedOption, 'createdBy');
              }}
              placeholder="Ng?????i t???o"
              styles={customStyles}
              defaultOptions
              value={meetingData.createdBy}
              loadOptions={(inputValue, callback) => {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
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
            />
          </Grid>
          <Grid sm="12" className="my-2">
            <AsyncSelect
              onChange={selectedOption => {
                this.handleChangeSelect(selectedOption, 'people');
              }}
              placeholder="Ng?????i tham gia"
              // label="Ng?????i tham gia"
              styles={customStyles}
              defaultOptions
              value={meetingData.people}
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
            />
          </Grid>
          <Grid sm="12" className="my-2">
            <AsyncAutocomplete
              name="Ch???n..."
              label={'Ng?????i t??? ch???c'}
              onChange={selectedOption => {
                this.handleChangeSelect(selectedOption, 'organizer');
              }}
              url={`${API_USERS}`}
              value={meetingData.organizer}
            // error={localMessages && localMessages['organizer.name']}
            // helperText={localMessages && localMessages['organizer.name']}
            // required={checkRequired['organizer.name']}
            // checkedShowForm={checkShowForm['organizer.name']}
            />
            {/* <AsyncSelect
              isMulti
              className="my-react-select"
              styles={customStyles}
              onChange={selectedOption => {
                this.handleChangeSelect(selectedOption, 'organizer');
              }}
              placeholder="Ng?????i t??? ch???c"
              defaultOptions
              value={meetingData.organizer}
              loadOptions={(inputValue, callback) => {
                clearTimeout(this.organizer);
                this.organizer = setTimeout(() => {
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
          </Grid>
          <Grid item sm={12} className="my-1 ">
            {meetingData.file !== undefined ? (
              <TextField
                id="outlined-full-width"
                variant="outlined"
                label="T???p ????nh k??m"
                value={meetingData.file}
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
                          window.open(meetingData.file);
                        }}
                      >
                        <CloudDownload />
                      </IconButton>
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={() => {
                          meetingData.file = undefined;
                          this.setState({ meetingData });
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
                id="outlined-full-width"
                label="T???p ????nh k??m"
                className=""
                type="file"
                value={meetingData.file}
                onChange={event => {
                  const { meetingData } = this.state;
                  meetingData.file = event.target.value;

                  this.meetingFile = event.target.files[0];
                  this.setState({ meetingData });
                }}
                margin="normal"
                variant="outlined"
              />
            )}
          </Grid>
          <Grid item sm={12} className="my-1 ">
            <TextField
              multiline
              rows={4}
              fullWidth
              id="outlined-full-width"
              InputLabelProps={{
                shrink: true,
              }}
              label="N???i dung"
              className=""
              value={meetingData.content}
              onChange={this.handleChangeInput('content')}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item sm={12} className="my-1 ">
            <TextField
              fullWidth
              multiline
              id="outlined-full-width"
              InputLabelProps={{
                shrink: true,
              }}
              label="K???t qu???"
              className=""
              value={meetingData.result}
              onChange={this.handleChangeInput('result')}
              margin="normal"
              variant="outlined"
              rows={4}
            />
          </Grid>
          <Grid item sm={12} className="my-1 text-right ">
            {/* <Button variant="outlined" color="primary" className="mx-1">
              Giao vi???c
            </Button> */}
            <Button
              onClick={() => {
                this.handleCreateMeeting();
              }}
              variant="outlined"
              color="primary"
              className="mx-1"
            >
              T???o l???ch h???p
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
