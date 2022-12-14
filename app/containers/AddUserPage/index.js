import {
  Button,
  Collapse,
  FormControl,
  FormHelperText,
  List,
  ListItem,
  ListItemIcon,
  Paper,
  TextField,
  Toolbar,
  IconButton,
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import CameraAlt from '@material-ui/icons/CameraAlt';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Edit, Close } from '@material-ui/icons';
import { Breadcrumbs } from '@material-ui/lab';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import AsyncSelect from '../../components/AsyncComponent';
import CustomAppBar from 'components/CustomAppBar';
import FormGroup from '@material-ui/core/FormGroup';
import RoleByFunction from '../../components/RoleByFunction';
import { API_USERS, API_CHECK_DUPLICATE_DATA, API_CHECK_DUPLICATE_USERNAME } from '../../config/urlConfig';
import avatarA from '../../images/avatar.png';
import { getLabelName, getUserRole } from '../../utils/common';
// import { typeEmployee } from '../../variable';
import DepartmentSelect from 'containers/AddRolesGroupPage/DetailDepartment';
import { addUserAction, editUserAct, getDepartmentAct, getModuleAct, getUserAct, resetNoti, merge } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectAddUserPage from './selectors';
import styles from './styles';
import messages from './messages';
import { CUSTOMER_TYPE_CODE } from '../../utils/constants';
import { clientId } from '../../variable';
import { fetchData } from '../../helper';
import _ from 'lodash';
import './style.scss';
import CustomDatePicker from '../../components/CustomDatePicker';
import { flatChild } from 'helper';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import ClearIcon from '@material-ui/icons/Clear';
import MomentUtils from '@date-io/moment';
import TodayIcon from '@material-ui/icons/Today';
import { changeSnackbar } from '../Dashboard/actions';
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

// const currencies = [
//   {
//     value: '1',
//     label: 'Nh??m 1',
//   },
//   {
//     value: '2',
//     label: 'Nh??m 2',
//   },
//   {
//     value: '3',
//     label: 'Nh??m 3',
//   },
//   {
//     value: '4',
//     label: 'Nh??m 4',
//   },
//   {
//     value: 'Admin',
//     label: 'Qu???n tr??? vi??n',
//   },
//   {
//     value: 'user',
//     label: 'Quy???n Xem',
//   },
// ];

const phanQuyenBaoCao = [
  {
    id: 1,
    titleFunction: 'B??o c??o ho???t ?????ng kinh doanh',
    GET: true,
    EXPORT: true,
  },
  {
    id: 2,
    titleFunction: 'B??o c??o c?? nh??n',
    GET: true,
    EXPORT: true,
  },
  {
    id: 3,
    titleFunction: 'B??o c??o qu???n tr??? ph??ng',
    GET: true,
    EXPORT: true,
  },
];
const BaoCaoPheDuyet = [
  {
    name: 'Ph?? duy???t b??o c??o',
    checked: true,
  },
  {
    name: 'Ph?? duy???t',
    checked: true,
    childrens: [
      {
        name: 'Ph?? duy???t ngh??? ph??p',
        checked: true,
      },
      {
        name: 'Ph?? duy???t b???ng l????ng',
        checked: false,
      },
      {
        name: 'Ph?? duy???t chi',
        checked: false,
      },
      {
        name: 'Ph?? duy???t thu',
        checked: true,
      },
      {
        name: 'Ph?? duy???t ??i???u chuy???n c??ng t??c',
        checked: false,
      },
    ],
  },
  {
    name: 'C???nh b??o',
    checked: false,
    childrens: [
      {
        name: 'C???nh b??o nh??n s??? ngh??? qu?? nhi???u',
        checked: true,
      },
      {
        name: 'C???nh b??o c??ng vi???c ch???m ti???n ?????',
        checked: false,
      },
    ],
  },
];

/* eslint-disable react/prefer-stateless-function */
export class AddUserPage extends React.PureComponent {
  state = {
    expanded: 'panel1',
    admin: false,
    avatarURL: '',
    avatar: '',
    value: 0,
    code: '',
    name: '',
    gender: 'male',
    email: '',
    mobileNumber: '',
    timeToJoin: new Date(),
    dob: '',
    address: '',
    IDcard: '',
    positions: '',
    organizationUnit: '',
    note: '',
    // roles: '',
    username: '',
    rePassword: '',
    password: '',
    listOrganizationUnit: [],
    active: false,
    errorName: false,
    errorCode: false,
    errorEmail: false,
    errorUsername: false,
    errorNotMatch: false,
    errorMobileNumber: false,
    errorPassword: false,
    errorOrganizationUnit: false,
    btnSave: false,
    user: null,
    messages: {
      errorCode: '',
      errorName: '',
      errorPassword: '',
      errorNotMatch: '',
      errorEmail: '',
      errorOrganizationUnit: '',
      errorUsername: '',
      errorMobileNumber: '',
    },
    fieldAdded: [],
    allFunctionForAdd: [],
    codeRoleGroupSelect: undefined,
    
    userExtendViewConfig: null,
    // type: 1,
    type: '',
    roleGroupSelectId: null,
    resetChild: false,
    userTypes: [],
    names: {
      errorCode: 'M?? nh??n vi??n',
      errorName: 'T??n nh??n vi??n',
      errorPassword: 'M???t kh???u',
      errorNotMatch: 'M???t kh???u',
      errorEmail: 'Email',
      errorOrganizationUnit: '????n v???',
      errorUsername: 'T??n ????ng nh???p',
      errorMobileNumber: 'S??? ??i???n tho???i',
    },
    isChangePwdRequired: false,
    resourcePortalUser: false,
    expiredDate: null,
    checkEdit: false,
    checkFirst: null,
  };

  getMessages = () => {
    const { messages, names } = this.state;

    let newMessages = {};
    Object.keys(messages).map(item => {
      if (messages[item].length === 0) {
        this.setState({
          [item]: true,
        });
        if (item !== 'errorOrganizationUnit') newMessages[`${item}`] = `${names[`${item}`]} t???i thi???u 5 k?? t???!`;
        if (item === 'errorUsername') newMessages[`${item}`] = `${names[`${item}`]} t???i thi???u 5 v?? t???i ??a 20 k?? t???!`;
        if (item === 'errorPassword') newMessages[`${item}`] = `${names[`${item}`]} t???i thi???u 7 k?? t???!`;
        if (item === 'errorNotMatch') newMessages[`${item}`] = `${names[`${item}`]} t???i thi???u 7 k?? t???!`;
        if (item === 'errorOrganizationUnit' || item === 'errorEmail') newMessages[`${item}`] = `${names[`${item}`]} kh??ng ???????c ????? tr???ng!`;
        if (item === 'errorMobileNumber') newMessages[`${item}`] = `${names[`${item}`]} kh??ng ???????c ????? tr???ng!`;
      }
    });
    this.setState(prevState => ({
      ...prevState,
      messages: newMessages,
    }));
  };

  componentWillMount() {
    this.props.onResetNoti();
    this.props.onGetOrganizationUnit();
    this.props.onGetModule();
    const { match } = this.props;
    if (match.params.id) {
      this.props.onGetUser(match.params.id);
    }
  }

  componentDidMount() {
    const { addUserPage } = this.props;

    if (this.props.match.params.id) {
      this.setState({ checkEdit: true });
    }
    if (!this.props.match.params.id) {
      this.getMessages();
    }
    this.state.listOrganizationUnit = [];
    // if (addUserPage.listOrganizationUnit) {
    addUserPage.listOrganizationUnit.forEach(unit => {
      const newItem = {
        id: unit.id,
        name: unit.name,
      };
      this.state.listOrganizationUnit.push(newItem);
      if (unit.child && unit.child.length > 0) {
        this.listChil(unit.child, 20);
      }
    });
    const { listOrganizationUnit } = this.state;

    if (listOrganizationUnit.length > 0) {
      const id = listOrganizationUnit[0].id;
      this.setState({ organizationUnit: id });
    }
    this.props.onResetNoti();
    const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = listViewConfig.find(item => item.code === 'Employee');
    if (currentViewConfig && this.state.fieldAdded.length === 0) {
      const fieldAdded = currentViewConfig.listDisplay.type.fields.type.others;
      const addVaue = fieldAdded.map(item => ({
        ...item,
        value: '',
      }));
      this.setState({ fieldAdded: addVaue });
    }

    try {
      const customerTypeSourceLocal = JSON.parse(localStorage.getItem('crmSource')) || null;
      const customerTypeSource = customerTypeSourceLocal ? customerTypeSourceLocal.find(item => item.code === CUSTOMER_TYPE_CODE) : null;
      if (customerTypeSource && Array.isArray(customerTypeSource.data) && customerTypeSource.data.length) {
        this.setState({ userTypes: customerTypeSource.data });
      }
    } catch (error) {}
    // const user = addUserPage.user || null;
    // if (user !== null && user._id) {
    //   const { modules = [], role = {} } = addUserPage;
    //   const { roles } = role;
    //   const allFunctionForAdd = getUserRole(roles, modules, clientId);
    //   this.setState({ allFunctionForAdd });
    //   this.setState({
    //     address: user.address,
    //     timeToJoin: moment(user.beginWork).format('YYYY-MM-DD'),
    //     code: user.code,
    //     email: user.email,
    //     dob: moment(user.dob).format('YYYY-MM-DD'),
    //     gender: user.gender === 'male' ? 0 : 1,
    //     id: user._id,
    //     IDcard: user.identityCardNumber,
    //     name: user.name,
    //     note: user.note,
    //     organizationUnit: user.organizationUnit,
    //     mobileNumber: user.phoneNumber,
    //     positions: user.positions,
    //     active: user.status === 1,
    //     user: user,
    //     avatarURL: user.avatar,
    //   });
    // }
  }

  componentDidUpdate(props) {
    const { addUserPage } = this.props;
    if (
      !this.state.errorName &&
      !this.state.errorCode &&
      !this.state.errorEmail &&
      !this.state.errorUsername &&
      !this.state.errorPassword &&
      !this.state.errorNotMatch &&
      !this.state.errorOrganizationUnit &&
      !this.state.errorMobileNumber
    ) {
      this.setState({ btnSave: true });
    } else {
      this.setState({ btnSave: false });
    }

    if (addUserPage.successCreate === true) {
      this.props.enqueueSnackbar('Thao t??c th??nh c??ng!', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      // this.props.history.push('/setting/Employee');
      this.props.history.goBack();
      this.props.onResetNoti();
    }
    if (addUserPage.error) {
      this.props.enqueueSnackbar('Thao t??c th???t b???i!', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      this.props.onResetNoti();
    }
  }

  componentWillUnmount() {
    this.setState({ user: null, resetChild: false });
  }

  componentWillReceiveProps(props) {
    if (props.addUserPage !== this.props.addUserPage) {
      const { addUserPage } = props;
      const user = addUserPage.user || null;
      const { modules = [], role = {} } = addUserPage;
      const { roles } = role;
      const allFunctionForAdd = getUserRole(roles, modules, clientId);
      this.setState({ allFunctionForAdd });
      if (props.addUserPage.listOrganizationUnit !== this.props.addUserPage.listOrganizationUnit) {
        this.state.listOrganizationUnit = [];
        addUserPage.listOrganizationUnit.forEach(unit => {
          const newItem = {
            id: unit._id,
            name: unit.name,
            padding: 0,
          };
          this.state.listOrganizationUnit.push(newItem);
          if (unit.child && unit.child.length > 0) {
            this.listChil(unit.child, 20);
          }
        });
      }
      if (user !== null && props.addUserPage.user !== this.props.addUserPage.user && String(user._id) === String(this.props.match.params.id)) {
        this.state.address = user.address;
        this.state.admin = user.admin;
        this.state.expiredDate = user.expiredDate;
        this.state.timeToJoin = (user.beginWork && moment(user.beginWork).format('YYYY-MM-DD')) || '';
        this.state.code = user.code;
        this.state.email = user.email;
        this.state.dob = moment(user.dob).format('YYYY-MM-DD');
        // this.state.gender = user.gender === 'male' ? 0 : 1;
        this.state.gender = user.gender;
        this.state.id = user.id;
        this.state.IDcard = user.identityCardNumber;
        this.state.name = user.name;
        this.state.note = user.note;
        this.state.organizationUnit = user.organizationUnit ? user.organizationUnit.organizationUnitId : '';
        this.state.userDepartment = user.organizationUnit ? user.organizationUnit.organizationUnitId : '';
        this.state.mobileNumber = user.phoneNumber;
        this.state.positions = user.positions;
        this.state.active = user.status === 1;
        this.state.user = user;
        // this.state.avatarURL = user.avatar;
        this.state.avatar = user.avatar;
        this.state.username = user.username;
        this.state.type = user.type;
        this.state.departmentRoles = user.allowedDepartment ? user.allowedDepartment.roles : [];
        this.state.codeRoleGroupSelect = user.roleGroupSource;
        this.state.sip_uri = user.sip_uri;
        this.state.sip_password = user.sip_password;
        this.state.resourcePortalUser = user.resourcePortalUser;
        this.setState({ checkFirst: user.resourcePortalUser });

        if (user.others && Object.keys(user.others).length > 0) {
          const { fieldAdded } = this.state;
          const keys = Object.keys(user.others);
          fieldAdded.forEach(item => {
            const index = keys.findIndex(n => n === item.name.replace('others.', ''));
            if (index > -1) {
              item.value = user.others[keys[index]];
            }
          });
          this.state.fieldAdded = fieldAdded;
        }
      }
    }
  }

  listChil = (chil, level) => {
    if (chil.length > 0) {
      chil.forEach(item => {
        const newItem = {
          id: item._id,
          name: item.name,
          padding: `${level}`,
        };
        this.state.listOrganizationUnit.push(newItem);
        if (item.child && item.child.length > 0) {
          this.listChil(item.child, level + 20);
        }
      });
    }
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };
  handleChangeDate = (e, fieldName) => {
    let name = fieldName;
    console.log(e, 'bfhbd');
    let value = (e && moment(e) && moment(e).format('YYYY/MM/DD')) || '';
    this.setState({ [name]: value });
  };

  handleChangeCheckbox = e => {
    this.setState({ [e.target.name]: e.target.checked });
  };

  validationMobilePhone = value => {
    const isNumeric = /^[0-9]+$/;
    return !isNumeric.test(value);
  };
  handleChangeD = (e, isDate) => {
    const name = isDate ? 'dob' : 'timeToJoin';
    const value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    this.setState({ [name]: value });
  };
  handleChangeInput = (e, isDate) => {
    // const name = isDate ? 'dob' : 'timeToJoin';
    // const value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    // this.setState({ [name]: value });

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { messages, password, names } = this.state;
    // console.log(this.code.value);
    if (
      e.target.name === 'name' ||
      e.target.name === 'code' ||
      e.target.name === 'email' ||
      e.target.name === 'username' ||
      e.target.name === 'password' ||
      e.target.name === 'rePassword' ||
      e.target.name === 'organizationUnit' ||
      e.target.name === 'mobileNumber'
    ) {
      if (e.target.name === 'name') {
        if (e.target.value === '' || e.target.value.length < 5) {
          this.setState({
            errorName: true,
            messages: { ...messages, errorName: `${names.errorName} t???i thi???u 5 k?? t???!` },
          });
        } else {
          this.setState({
            errorName: false,
            messages: { ...messages, errorName: '' },
          });
        }
      }
      if (e.target.name === 'code') {
        if (e.target.value === '' || e.target.value.length < 5) {
          this.setState({
            errorCode: true,
            messages: { ...messages, errorCode: `${names.errorCode} t???i thi???u 5 k?? t???!` },
          });
        } else {
          this.setState({
            errorCode: false,
            messages: { ...messages, errorCode: '' },
          });
          this.checkMatchData(e.target.name, e.target.value);
        }
      }
      if (e.target.name === 'email') {
        if (e.target.value === '') {
          this.setState({
            errorEmail: true,
            messages: { ...messages, errorEmail: 'Kh??ng ???????c ????? tr???ng Email!' },
          });
        } else {
          if (re.test(String(e.target.value).toLowerCase())) {
            this.setState({
              errorEmail: false,
              messages: { ...messages, errorEmail: '' },
            });
            this.checkMatchData(e.target.name, e.target.value);
          } else {
            this.setState({
              errorEmail: true,
              messages: { ...messages, errorEmail: 'Email kh??ng h???p l???!' },
            });
          }
        }
      }
      if (e.target.name === 'username') {
        if (e.target.value === '' || e.target.value.length < 5 || e.target.value.length > 20) {
          this.setState({
            errorUsername: true,
            messages: { ...messages, errorUsername: `${names.errorUsername} t???i thi???u 5 v?? t???i ??a 20 k?? t???!` },
          });
        } else {
          this.setState({
            errorUsername: false,
            messages: { ...messages, errorUsername: '' },
          });
          this.checkMatchData(e.target.name, e.target.value);
        }
      }
      if (e.target.name === 'password') {
        if (e.target.value === '' || e.target.value.length < 7) {
          this.setState({
            errorPassword: true,
            messages: { ...messages, errorPassword: `${names.errorPassword} t???i thi???u 7 k?? t???!` },
          });
        } else {
          this.setState({
            errorPassword: false,
            messages: { ...messages, errorPassword: '' },
          });
        }
      }
      if (e.target.name === 'organizationUnit') {
        if (e.target.value === '') {
          this.setState({
            errorOrganizationUnit: true,
            messages: { ...messages, errorOrganizationUnit: `${names.errorOrganizationUnit} kh??ng ???????c ????? tr???ng!` },
          });
        } else {
          this.setState({
            errorOrganizationUnit: false,
            messages: { ...messages, errorOrganizationUnit: '' },
          });
        }
      }
      if (e.target.name === 'rePassword') {
        if (e.target.value === '') {
          this.setState({
            errorNotMatch: true,
            messages: { ...messages, errorNotMatch: `${names.errorNotMatch} kh??ng ???????c ????? tr???ng!` },
          });
        } else if (password === '') {
          this.setState({
            errorPassword: true,
            messages: { ...messages, errorPassword: `${names.errorPassword} kh??ng ???????c ????? tr???ng!` },
          });
        } else if (!(password === e.target.value)) {
          this.setState({
            errorNotMatch: true,
            messages: { ...messages, errorNotMatch: `${names.errorNotMatch} kh??ng kh???p` },
          });
        } else {
          this.setState({
            errorNotMatch: false,
            messages: { ...messages, errorNotMatch: '' },
          });
        }
      }
      if (e.target.name === 'mobileNumber') {
        if (e.target.value.length <= 0)
          this.setState({
            errorMobileNumber: true,
            messages: { ...messages, errorMobileNumber: 'S??? ??i???n tho???i kh??ng ???????c ????? tr???ng!' },
          });
        else if (this.validationMobilePhone(e.target.value)) {
          this.setState({
            errorMobileNumber: true,
            messages: { ...messages, errorMobileNumber: 'S??? ??i???n tho???i kh??ng h???p l???!' },
          });
        } else {
          this.setState({
            errorMobileNumber: false,
            messages: { ...messages, errorMobileNumber: '' },
          });
        }
      }
    }

    this.setState({ [e.target.name]: e.target.value });
  };

  checkMatchData = _.debounce((name, value) => {
    const { messages } = this.state;
    let body = {
      [name]: value,
    };
    if (name === 'code' || name === 'email') {
      fetchData(API_CHECK_DUPLICATE_DATA, 'POST', body).then(data => {
        if (data.status === 0) {
          if (name === 'code') {
            this.setState({
              errorCode: true,
              messages: { ...messages, errorCode: 'M?? nh??n vi??n b??? tr??ng! Vui l??ng nh???p m?? kh??c' },
            });
          } else {
            this.setState({
              errorEmail: true,
              messages: { ...messages, errorEmail: 'Email b??? tr??ng! Vui l??ng nh???p email kh??c' },
            });
          }
        } else {
          if (name === 'code') {
            this.setState({
              errorCode: false,
              messages: { ...messages, errorCode: '' },
            });
          } else {
            this.setState({
              errorEmail: false,
              messages: { ...messages, errorEmail: '' },
            });
          }
        }
      });
    }
    if (name === 'username') {
      fetchData(API_CHECK_DUPLICATE_USERNAME, 'POST', body).then(data => {
        if (data.status === 0) {
          this.setState({
            errorUsername: true,
            messages: { ...messages, errorUsername: 'T??i kho???n b??? tr??ng! Vui l??ng nh???p t??i kho???n kh??c' },
          });
        } else {
          this.setState({
            errorUsername: false,
            messages: { ...messages, errorUsername: '' },
          });
        }
      });
    }
  }, 500);

  onSelectImg = e => {
    // const types = ['image/png', 'image/jpeg', 'image/gif'];
    // const file = e.target.files[0];
    // k c?? file
    // if (!file) return false;

    // // let checkFile = true;
    // // let txt = '';

    // // // check image type
    // // if (types.every(type => file.type !== type)) {
    // //   checkFile = false;
    // //   txt = 'File b???n v???a ch???n kh??ng ????ng ?????nh d???ng';
    // //   // check image size > 3mb
    // // } else if (file.size / 1024 / 1024 > 3) {
    // //   checkFile = false;
    // //   txt = 'Dung l?????ng file t???i ??a l?? 3MB';
    // // }

    // // confirm logo
    // if (!checkFile) {
    //   // this.props.enqueueSnackbar(txt, {
    //   //   variant: 'error',
    //   //   anchorOrigin: {
    //   //     vertical: 'bottom',
    //   //     horizontal: 'right',
    //   //   },
    //   //   autoHideDuration: 3000,
    //   // });
    // } else {
    //   const urlAvt = URL.createObjectURL(e.target.files[0]);
    //   this.setState({ avatarURL: urlAvt });
    // }
    const urlAvt = URL.createObjectURL(e.target.files[0]);
    this.setState({ avatarURL: urlAvt, avatar: e.target.files[0] }); // avatar: e.target.files[0]
  };

  handleChangeRole = allFunctionForAdd => {
    this.state.allFunctionForAdd = allFunctionForAdd;
  };

  handleChangeRoleGroup = e => {
    console.log(e.target.value, "e.target.value");
    const { addUserPage } = this.props;
    const listOrganizationUnit = flatChild(addUserPage.listOrganizationUnit);
    const modules = addUserPage.modules || [];
    const roleGroupSelect = addUserPage.roleGroups.find(roleGroup => roleGroup.code === e.target.value) || {};
    console.log(roleGroupSelect, "e.target.value");

    const { roles, applyEmployeeOrgToModuleOrg, departments } = roleGroupSelect;
    // const { roles } = roleGroupSelect;
    const allFunctionForAdd = getUserRole(roles, modules, clientId);
    if (applyEmployeeOrgToModuleOrg) {
      const allowedDepartment = {
        moduleCode: applyEmployeeOrgToModuleOrg,
        roles: [
          {
            code: 'DERPARTMENT',
            column: [
              {
                name: 'view',
                title: 'Xem',
              },
              {
                name: 'edit',
                title: 'S???a',
              },
              {
                name: 'delete',
                title: 'X??a',
              },
            ],
            data: listOrganizationUnit.map(item => ({
              data:
                this.state.organizationUnit && item.slug.includes(this.state.organizationUnit)
                  ? { view: true, edit: true, delete: true }
                  : { view: false, edit: false, delete: false },
              expand: false,
              id: item._id,
              name: item._id,
              open: true,
              slug: item.slug,
            })),
            type: 0,
            name: 'Ph??ng ban',
            row: listOrganizationUnit.map(l => ({
              access: false,
              expand: false,
              id: l._id,
              level: l.level,
              name: l._id,
              open: false,
              parent: l.parent,
              slug: l.slug,
              title: l.name,
            })),
          },
        ],
      };
      this.setState({ allowedDepartment, departmentRoles: allowedDepartment.roles });
    } else {
      const { departments } = roleGroupSelect || {};
      const { roles = [] } = departments || {};
      let role = roles.find(e => e.code === 'DERPARTMENT');
      if (role) {
        role = role.data ? role.data : [];
        const allowedDepartment = {
          moduleCode: true,
          roles: [
            {
              code: 'DERPARTMENT',
              column: [
                {
                  name: 'view',
                  title: 'Xem',
                },
                {
                  name: 'edit',
                  title: 'S???a',
                },
                {
                  name: 'delete',
                  title: 'X??a',
                },
              ],
              data: this.state.listOrganizationUnit.map(item => {
                const r = role.find(e => e.id === item._id);
                return {
                  data: r && r.data ? { view: r.data.view, edit: r.data.edit, delete: r.data.delete } : { view: false, edit: false, delete: false },
                  expand: false,
                  id: item._id,
                  name: item._id,
                  open: true,
                  slug: item.slug,
                };
              }),
              type: 0,
              name: 'Ph??ng ban',
              row: this.state.listOrganizationUnit.map(l => ({
                access: false,
                expand: false,
                id: l._id,
                level: l.level,
                name: l._id,
                open: false,
                parent: l.parent,
                slug: l.slug,
                title: l.name,
              })),
            },
          ],
        };
        this.setState({ allowedDepartment, departmentRoles: allowedDepartment.roles });
      }
    }
    const newDepartments = departments && departments.roles.find(it => it.code === 'DERPARTMENT');
    const allDepartment = newDepartments && newDepartments.data.map(i => ({ ...i.data, id: i.id }));
    this.setState({
      codeRoleGroupSelect: e.target.value,
      allFunctionForAdd,
      roleGroupSelectId: roleGroupSelect._id,
      resetChild: !applyEmployeeOrgToModuleOrg,
      allDepartment,
      applyEmployeeOrgToModuleOrg,
    });
  };

  handleChangeRoles = departments => {
    this.setState({ allDepartment: departments });
    const { allFunctionForAdd, applyEmployeeOrgToModuleOrg, allowedDepartment } = this.state;
    const roles = [];
    if (allowedDepartment)
      allFunctionForAdd.map(row => {
        const GET = row.methods.find(item => item.name === 'GET').allow;
        const PUT = row.methods.find(item => item.name === 'PUT').allow;
        const DELETE = row.methods.find(item => item.name === 'DELETE').allow;
        const role = !applyEmployeeOrgToModuleOrg
          ? allowedDepartment.roles.map(it => ({
              ...it,
              name: 'Ph??ng ban',
              data: it.data.map(i => ({
                ...i,
                data: { view: GET ? i.data.view : false, edit: PUT ? i.data.edit : false, delete: DELETE ? i.data.delete : false },
              })),
            }))
          : allowedDepartment.roles.map(it => ({
              ...it,
              name: 'Ph??ng ban',
              data: it.data.map(i => ({ ...i, data: { view: false, edit: false, delete: false } })),
            }));
        roles.push({ moduleCode: row.codeModleFunction, roles: role });
        // row.methods.find(item => item.name === 'GET').allow && roles.push({ moduleCode: row.codeModleFunction, roles: allowedDepartment.roles })
      });
    this.setState({ roles });
  };

  handleChangeAllowedDepart = (departments, row) => {
    // console.log('row', row);
    // thay doi phong ban them moi
    const roles = [...departments];
    const moduleCode = 'applyEmployeeOrgToModuleOrg';
    const allowedDepartment = {
      moduleCode,
      roles: [
        {
          code: 'DERPARTMENT',
          column: [
            {
              name: 'view',
              title: 'Xem',
            },
            {
              name: 'edit',
              title: 'S???a',
            },
            {
              name: 'delete',
              title: 'X??a',
            },
          ],
          data: roles.map(item => ({ data: item.data, expand: item.expand, id: item.id, name: item.name, open: item.open, slug: item.slug })),
          type: 0,
          name: 'Ph??ng ban',
          row,
        },
      ],
    };
    this.setState({ allowedDepartment });
  };
  componentWillUnmount() {
    this.setState({ allowedDepartment: [] });
    this.props.mergeData({ role: {} });
  }

  handleChangeType = name => e => {
    this.setState({ [name]: e.target.value });
  };

  render() {
    const { classes, addUserPage, intl } = this.props;
    const { expanded, value, userTypes, checkEdit, gender } = this.state;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    let roleGroupsId =
      addUserPage !== undefined && addUserPage.roleGroups !== undefined && addUserPage.roleGroups.length > 0
        ? addUserPage.roleGroups[0]._id
        : undefined;
    let roleGroupsCode =
      addUserPage !== undefined && addUserPage.roleGroups !== undefined && addUserPage.roleGroups.length > 0
        ? addUserPage.roleGroups[0].code
        : undefined;

    const showDataTable = data => {
      const tag = [];
      data.forEach(row => {
        tag.push(
          <ListItem>
            <ListItemIcon>
              {/* <InboxIcon /> */}
              <Checkbox checked={row.checked} />
            </ListItemIcon>
            <span style={{ fontSize: '0.75rem' }}>{row.name}</span>
          </ListItem>,
        );
        if (row.childrens)
          row.childrens.forEach(child => {
            tag.push(
              <Collapse style={{ marginLeft: 40 }} in>
                <List component="div" disablePadding>
                  <ListItem button className={{ marginLeft: 10, height: 20 }}>
                    <ListItemIcon>
                      <Checkbox checked={child.checked} />
                    </ListItemIcon>
                    <span style={{ fontSize: '0.75rem' }}>{child.name}</span>
                  </ListItem>
                </List>
              </Collapse>,
            );
          });
      });
      return tag;
    };
    return (
      <div className={classes.root}>
        {/* <AppBar className='HeaderAppBarUser'>
              <Toolbar>
                <IconButton
                  className='BTNUser'
                  color="inherit"
                  variant="contained"
                  onClick={this.goBack}
                  aria-label="Close"
                >
                  <Close />
                </IconButton>
                <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
                  {addStock === 'add'
                    ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'th??m m???i ng??????i du??ng' })}`
                    : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'C???p nh???t ng??????i du??ng' })}`}
                </Typography>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={addStock === 'add' ? this.onSubmit : this.onEditBtn}
                >
                  {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'L??u' })}
                </Button>
              </Toolbar>
            </AppBar> */}
        <CustomAppBar
          className
          title={
            addStock === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Th??m m???i ng??????i du??ng' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'C???p nh???t ng??????i du??ng' })}`
          }
          onGoBack={this.goBack}
          onSubmit={addStock === 'add' ? this.onSubmit : this.onEditBtn}
        />
        <Helmet>
          {this.state.user === null ? <title>Th??m m???i nh??n s???</title> : <title>S???a nh??n s???</title>}
          <meta name="description" content="Description of AddUserPage" />
        </Helmet>
        {/* <Paper className={classes.breadcrumbs}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/setting/Employee">
              Danh s??ch nh??n s???
            </Link>
            {this.state.user === null ? (
              <Typography color="textPrimary">Th??m m???i nh??n s???</Typography>
            ) : (
                <Typography color="textPrimary">S???a nh??n s???</Typography>
              )}
          </Breadcrumbs>
        </Paper> */}
        {/* <Typography h1>Th??m m???i nh??n s???</Typography> */}
        <Grid container>
          <Grid item md={8}>
            <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>{intl.formatMessage(messages.employeeInfo || { id: 'employeeInfo' })}</Typography>
                <Typography className={classes.secondaryHeading}>{intl.formatMessage(messages.warning || { id: 'warning' })}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container>
                  <Grid item md={6} spacing={6}>
                    <FormControl className={classes.textField1} error>
                      <TextField
                        id="code"
                        label={intl.formatMessage(messages.employeeCode || { id: 'employeeCode' })}
                        onChange={this.handleChangeInput}
                        type="text"
                        className={classes.textField}
                        value={this.state.code}
                        name="code"
                        variant="outlined"
                        // inputRef={input => (this.code = input)}
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                        helperText={this.state.messages && this.state.messages.errorCode}
                        error={this.state.errorCode}
                      />
                      {/* {this.state.errorCode ? (
                        <FormHelperText id="component-error-text1" style={{ marginTop: -5 }}>
                          {this.state.messages.errorCode}
                        </FormHelperText>
                      ) : (
                          ''
                        )} */}
                    </FormControl>
                  </Grid>
                  <Grid item md={6} spacing={6}>
                    <FormControl className={classes.textField} style={{ padding: 0 }} error>
                      <TextField
                        id="name"
                        label={intl.formatMessage(messages.employeeName || { id: 'employeeName' })}
                        value={this.state.name}
                        variant="outlined"
                        name="name"
                        onChange={this.handleChangeInput}
                        type="text"
                        // className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        required
                        helperText={this.state.messages && this.state.messages.errorName}
                        error={this.state.errorName}
                      />
                      {/* {this.state.errorName ? (
                        <FormHelperText id="component-error-text1" style={{ marginTop: -5 }}>
                          {this.state.messages.errorName}
                        </FormHelperText>
                      ) : (
                          ''
                        )} */}
                    </FormControl>
                  </Grid>
                  <Grid item md={6} spacing={6}>
                    <TextField
                      id="standard-select-currency"
                      select
                      label={intl.formatMessage(messages.sex || { id: 'sex' })}
                      name="gender"
                      className={classes.textField}
                      variant="outlined"
                      value={this.state.gender}
                      onChange={this.handleChangeInput}
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu,
                        },
                      }}
                      // helperText="Please select your currency"
                      margin="normal"
                    >
                      <MenuItem key="0" value={'male'}>
                        Nam
                      </MenuItem>
                      <MenuItem key="1" value={'female'}>
                        N???
                      </MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item md={6} spacing={6}>
                    <MuiPickersUtilsProvider utils={MomentUtils} locale="vi-VN">
                      <div style={{ position: 'relative' }}>
                        <DatePicker
                          id="dob"
                          label={getLabelName('dob', 'Employee')}
                          name="dob"
                          variant="outlined"
                          value={this.state.dob}
                          onChange={e => this.handleChangeD(e, true)}
                          className={classes.textField}
                          inputVariant="outlined"
                          invalidLabel="DD/MM/YYYY"
                          format="DD/MM/YYYY"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            endAdornment: (
                              <IconButton>
                                <TodayIcon />
                              </IconButton>
                            ),
                          }}
                          margin="normal"
                          disableFuture
                          helperText={null}
                          error={false}
                          style={{ width: '95%' }}
                        />
                        {this.state.dob ? (
                          <IconButton
                            style={{ position: 'absolute', top: '20px', right: '65px' }}
                            edge="end"
                            size="small"
                            onClick={() => this.handleChangeDate(null, 'dob')}
                          >
                            <ClearIcon />
                          </IconButton>
                        ) : null}
                      </div>
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={6} spacing={6}>
                    <FormControl className={classes.textField1} style={{ padding: 0 }} error>
                      <TextField
                        id="email"
                        label={getLabelName('email', 'Employee')}
                        // inputRef={input => (this.email = input)}
                        type="text"
                        variant="outlined"
                        name="email"
                        className={classes.textField}
                        onChange={this.handleChangeInput}
                        value={this.state.email}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        required
                        helperText={this.state.messages && this.state.messages.errorEmail}
                        error={this.state.errorEmail}
                      />

                      {/* {this.state.errorEmail ? (
                        <FormHelperText id="component-error-text1" style={{ marginTop: -5 }}>
                          {this.state.messages.errorEmail}
                        </FormHelperText>
                      ) : (
                          ''
                        )} */}
                    </FormControl>
                  </Grid>
                  <Grid item md={6} spacing={6}>
                    <TextField
                      id="cmtnd"
                      label={intl.formatMessage(messages.idCard || { id: 'idCard' })}
                      name="IDcard"
                      variant="outlined"
                      // value={this.state.age}
                      onChange={this.handleChangeInput}
                      type="number"
                      className={classes.textField}
                      value={this.state.IDcard}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item md={6} spacing={6}>
                    <TextField
                      id="phoneNumber"
                      // label={getLabelName('phoneNumber', 'Employee')}
                      label={intl.formatMessage(messages.phone || { id: 'phone' })}
                      value={this.state.mobileNumber}
                      name="mobileNumber"
                      variant="outlined"
                      onChange={this.handleChangeInput}
                      type="text"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                      required
                      helperText={this.state.messages && this.state.messages['errorMobileNumber']}
                      error={this.state.errorMobileNumber}
                    />
                  </Grid>
                  <Grid item md={6} spacing={6}>
                    <TextField
                      id="address"
                      label={intl.formatMessage(messages.address || { id: 'address' })}
                      value={this.state.address}
                      variant="outlined"
                      name="address"
                      onChange={this.handleChangeInput}
                      type="text"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item md={6} spacing={6}>
                    <MuiPickersUtilsProvider utils={MomentUtils} locale="vi-VN">
                      <div style={{ position: 'relative' }}>
                        <DatePicker
                          name="timeToJoin"
                          label={intl.formatMessage(messages.timeJoin || { id: 'timeJoin' })}
                          variant="outlined"
                          value={this.state.timeToJoin}
                          className={classes.textField}
                          onChange={e => this.handleChangeD(e, false)}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputVariant="outlined"
                          invalidLabel="DD/MM/YYYY"
                          format="DD/MM/YYYY"
                          InputProps={{
                            endAdornment: (
                              <IconButton>
                                <TodayIcon />
                              </IconButton>
                            ),
                          }}
                          margin="normal"
                          error={false}
                          helperText={null}
                          style={{ width: '95%' }}
                        />
                        {this.state.timeToJoin ? (
                          <IconButton
                            style={{ position: 'absolute', top: '20px', right: '65px' }}
                            edge="end"
                            size="small"
                            onClick={() => this.handleChangeDate(null, 'timeToJoin')}
                          >
                            <ClearIcon />
                          </IconButton>
                        ) : null}
                      </div>
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={6} spacing={6}>
                    <TextField
                      id="standard-select-currency"
                      select
                      label={intl.formatMessage(messages.organizationUnit || { id: 'organizationUnit' })}
                      name="organizationUnit"
                      className={classes.textField}
                      variant="outlined"
                      value={this.state.organizationUnit}
                      onChange={this.handleChangeInput}
                      required
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu,
                        },
                      }}
                      helperText={this.state.messages && this.state.messages['errorOrganizationUnit']}
                      error={this.state.errorOrganizationUnit}
                      margin="normal"
                    >
                      {this.state.listOrganizationUnit.map(item => (
                        <MenuItem
                          key={item.id}
                          value={item.id}
                          style={item.padding !== 0 ? { paddingLeft: `${parseInt(item.padding, 10) * 1.5}px` } : {}}
                        >
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item md={6} spacing={6}>
                    <TextField
                      id="standard-select-currency"
                      // select
                      name="positions"
                      label={intl.formatMessage(messages.positions || { id: 'positions' })}
                      variant="outlined"
                      onChange={this.handleChangeInput}
                      className={classes.textField}
                      value={this.state.positions}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu,
                        },
                      }}
                      // helperText="Please select your currency"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item md={6} spacing={6}>
                    <TextField
                      id="note"
                      label={intl.formatMessage(messages.note || { id: 'note' })}
                      variant="outlined"
                      value={this.state.note}
                      onChange={this.handleChangeInput}
                      name="note"
                      type="text"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item md={6} style={{ marginTop: 20 }}>
                    <TextField
                      value={this.state.type}
                      fullWidth
                      // name={intl.formatMessage(messages.species || { id: 'species' })}
                      // select
                      name="species"
                      type="text"
                      id="species"
                      onChange={this.handleChangeType('type')}
                      // label={intl.formatMessage(messages.species || { id: 'species' })}
                      label="?????i t?????ng s??? d???ng t??i kho???n"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      // SelectProps={{
                      //   MenuProps: {
                      //     className: classes.menu,
                      //   },
                      // }}
                      className={classes.textField}
                    />
                    {/* {userTypes.map(item => (
                        <MenuItem value={item.value}>{item.title}</MenuItem>
                      ))} */}
                    {/* </TextField> */}
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Th??ng tin kh??c</Typography>
                {/* <Typography className={classes.secondaryHeading}>C??c tr?????ng c?? d???u * l?? b???t bu???c</Typography> */}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid item container md={12} spacing={16}>
                  {/* {this.state.user === null ? ( */}
                  <Grid item md={6}>
                    <AsyncSelect
                      onChange={value => {
                        this.setState({ userExtendViewConfig: value._id });
                      }}
                      value={this.state.userExtendViewConfig}
                      style={{ width: '100%' }}
                      placeholder="K??? th???a viewConfig t???"
                      API={API_USERS}
                      modelName="Employee"
                      theme={theme => ({
                        ...theme,
                        spacing: {
                          ...theme.spacing,
                          controlHeight: '55px',
                        },
                      })}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <FormGroup row style={{ height: 70 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="admin"
                            checked={this.state.admin}
                            onChange={() => {
                              this.setState({ admin: !this.state.admin });
                            }}
                          />
                        }
                        label="C???p nh???t to??n h??? th???ng"
                      />
                    </FormGroup>
                  </Grid>
                  {/* ) : null} */}
                  {this.state.fieldAdded.length > 0
                    ? this.state.fieldAdded.map((item, index) => {
                        if (item.checked) {
                          return (
                            <Grid item md={6} key={item.name}>
                              <TextField
                                label={item.title}
                                variant="outlined"
                                type={item.type === 'string' ? 'text' : item.type}
                                value={item.value}
                                onChange={event => this.handleChangeAddedField(index, event)}
                                style={{ width: '100%' }}
                                margin="normal"
                              />
                            </Grid>
                          );
                        }
                      })
                    : ''}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Th??ng tin nh??n vi??n ????ng nh???p</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container>
                  <Grid item md={6}>
                    <FormControl className={classes.textField1} style={{ padding: 0 }} error>
                      <TextField
                        id="username"
                        label="T??i kho???n: "
                        value={this.state.username}
                        name="username"
                        onChange={this.handleChangeInput}
                        type="text"
                        disabled={this.state.user !== null}
                        className={classes.textField}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        required
                        error={this.state.errorUsername}
                      />
                      {this.state.errorUsername ? (
                        <FormHelperText id="component-error-text1" style={{ marginTop: -5 }}>
                          {this.state.messages.errorUsername}
                        </FormHelperText>
                      ) : (
                        ''
                      )}
                    </FormControl>
                  </Grid>
                  {this.state.user === null ? (
                    <Grid item md={6} spacing={6}>
                      <FormControl className={classes.textField1} style={{ paddingBottom: 0 }} error>
                        <TextField
                          id="pass"
                          label="M???t kh???u : "
                          value={this.state.password}
                          name="password"
                          onChange={this.handleChangeInput}
                          variant="outlined"
                          type="password"
                          className={classes.textField}
                          disabled={this.state.user !== null}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          margin="normal"
                          required
                          error={this.state.errorPassword}
                        />
                        {this.state.errorPassword ? (
                          <FormHelperText id="component-error-text1" style={{ marginTop: -5 }}>
                            {this.state.messages.errorPassword}
                          </FormHelperText>
                        ) : (
                          ''
                        )}
                      </FormControl>
                    </Grid>
                  ) : (
                    ''
                  )}

                  {this.state.user === null ? (
                    <Grid item md={6} spacing={6}>
                      <FormControl className={classes.textField1} style={{ padding: 0 }} error>
                        <TextField
                          id="repasss"
                          label="Nh???p l???i m???t kh???u: "
                          value={this.state.rePassword}
                          name="rePassword"
                          variant="outlined"
                          onChange={this.handleChangeInput}
                          type="password"
                          disabled={this.state.user !== null}
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          margin="normal"
                          required
                          error={this.state.errorNotMatch}
                        />
                        {this.state.errorNotMatch ? (
                          <FormHelperText id="component-error-text1" style={{ marginTop: -5 }}>
                            {this.state.messages.errorNotMatch}
                          </FormHelperText>
                        ) : (
                          ''
                        )}
                      </FormControl>
                    </Grid>
                  ) : (
                    ''
                  )}
                  <Grid item md={6} spacing={6}>
                    {/* <FormControl className={classes.textField1} style={{ paddingTop: '16px' }}>
                      <TextField
                        id="date"
                        label="Ng??y k???t th??c"
                        type="date"
                        className={classes.textField}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </FormControl> */}
                    <MuiPickersUtilsProvider utils={MomentUtils} locale="vi-VN">
                      <div style={{ position: 'relative' }}>
                        <DatePicker
                          label="Ng??y k???t th??c"
                          value={this.state.expiredDate}
                          // onChange={e => this.handleChangeFilter(e, false)}
                          variant="outlined"
                          inputVariant="outlined"
                          invalidLabel="DD/MM/YYYY"
                          format="DD/MM/YYYY"
                          InputProps={{
                            endAdornment: (
                              <IconButton>
                                <TodayIcon />
                              </IconButton>
                            ),
                          }}
                          name="expiredDate"
                          margin="normal"
                          onChange={e => this.handleChangeDate(e, 'expiredDate')}
                          // style={{ width: '100%', zIndex: 0 }}
                        />
                        {this.state.expiredDate ? (
                          <IconButton
                            style={{ position: 'absolute', top: '20px', right: '65px' }}
                            edge="end"
                            size="small"
                            onClick={() => this.handleChangeDate(null, 'expiredDate')}
                          >
                            <ClearIcon />
                          </IconButton>
                        ) : null}
                      </div>
                    </MuiPickersUtilsProvider>
                    {/* <div style={{ width: '100%' }}>
                      <FormControlLabel control={<Checkbox color="primary" value="checkedA" />} label="Kh??ng ho???t ?????ng :" labelPlacement="start" />
                    </div> */}
                  </Grid>
                  <Grid item md={6} spacing={6}>
                    <TextField
                      id="standard-multiline-static"
                      label="L?? do kh??ng tham gia ho???t ?????ng"
                      multiline
                      InputLabelProps={{
                        shrink: true,
                      }}
                      rows="4"
                      className={classes.textField}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid>
                    <FormGroup row className={classes.tetxCheckBox}>
                      {/* <Typography>B???t bu???c thay ?????i m???t kh???u khi l???n ?????u ????ng nh???p</Typography> */}
                      <FormControlLabel
                        name="isChangePwdRequired"
                        onChange={this.handleChangeCheckbox}
                        control={<Checkbox />}
                        label="B???t bu???c thay ?????i m???t kh???u khi l???n ?????u ????ng nh???p"
                        labelPlacement="end"
                        checked={this.state.isChangePwdRequired}
                      />
                      {/* <FormControlLabel
                        control={<Checkbox checked={this.state.active} />}
                        label="Active"
                        labelPlacement="end"
                        value={this.state.active}
                        name="active"
                        onChange={this.handleChangeCheckbox}
                      /> */}
                      {/* <FormControlLabel control={<Checkbox />} label="Deleted" labelPlacement="end" /> */}
                      <FormControlLabel
                        checked={this.state.resourcePortalUser}
                        disabled={checkEdit && this.state.checkFirst ? true : false}
                        name="resourcePortalUser"
                        onChange={this.handleChangeCheckbox}
                        control={<Checkbox />}
                        label="User c???ng th??ng tin nh??n s???"
                        labelPlacement="end"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>

            <ExpansionPanel expanded={expanded === 'panel5'} onChange={this.handleChange('panel5')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>C???u h??nh t???ng ????i t??ch h???p</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container>
                  <Grid item md={6} spacing={6}>
                    <TextField
                      id="sip_uri"
                      label="SIP URI"
                      className={classes.textField}
                      value={this.state.sip_uri}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={this.handleChangeInput}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>

                  <Grid item md={6} spacing={6}>
                    <TextField
                      id="password"
                      type="password"
                      label="M???t kh???u"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      className={classes.textField}
                      value={this.state.sip_password}
                      onChange={this.handleChangeInput}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>

            <ExpansionPanel expanded={expanded === 'panel4'} onChange={this.handleChange('panel4')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Ph??n quy???n truy c???p cho nh??n vi??n</Typography>
                <Typography className={classes.secondaryHeading}>T??ch v??o c??c t??nh n??ng m?? b???n mu???n nh??n vi??n truy c???p</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid item md={12}>
                  <TextField
                    className={classes.textField}
                    select
                    label="Nh??m ph??n quy???n"
                    value={this.state.codeRoleGroupSelect || roleGroupsCode}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={this.handleChangeRoleGroup}
                    SelectProps={{
                      MenuProps: {
                        className: classes.menu,
                      },
                    }}
                    // helperText="Please select your currency"
                    margin="normal"
                  >
                    {addUserPage.roleGroups.map(option => (
                      <MenuItem key={option.code} value={option.code}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </ExpansionPanelDetails>
              <Grid item md={12}>
                <div style={{ width: '100%' }}>
                  <AppBar position="static">
                    <Tabs value={value} onChange={this.handleChangeValue}>
                      <Tab className={classes.btnAppBar} label="Ph??n quy???n ch???c n??ng" />
                      {/* <Tab className={classes.btnAppBar} label="Ph??n quy???n ph??ng ban" /> */}
                      {/* <Tab className={classes.btnAppBar} label="Ph??n quy???n ph??ng ban" />
                        <Tab className={classes.btnAppBar} label="Ph??n quy???n b??o c??o" />
                        <Tab className={classes.btnAppBar} label="Ph??n quy???n b??o c??o v?? ph?? duy???t" /> */}
                    </Tabs>
                  </AppBar>
                </div>
              </Grid>
            </ExpansionPanel>

            {/* {this.state.user === null ? (
              <Button disabled={!this.state.btnSave} variant="contained" color="primary" style={{ marginTop: 20 }} onClick={this.onSubmit}>
                Th??m m???i
              </Button>
            ) : (
                <Button disabled={!this.state.btnSave} variant="contained" color="primary" style={{ marginTop: 20 }} onClick={this.onEditBtn}>
                  S???a
                </Button>
              )} */}
            {/* <Button variant="contained" onClick={this.goBack} style={{ marginTop: 20, marginLeft: 20 }}>
              H???y
            </Button> */}
          </Grid>
          <Grid style={{ height: 200 }} item md={4} container justify="center">
            {/* <Avatar style={{ width: 300, height: 300 }} src={avatarA} className={classes.avatar} srcSet={this.state.avatarURL} /> */}
            {addStock === 'add' ? (
              <Avatar src={`${this.state.avatarURL}` || avatarA} className={classes.avatar} />
            ) : (
              <div>
                {this.state.avatar === undefined || this.state.avatar === '' ? (
                  <Avatar src={`${this.state.avatarURL}` || avatarA} className={classes.avatar} />
                ) : (
                  <Avatar src={`${this.state.avatarURL}` || `${this.state.avatar}?allowDefault=true`} className={classes.avatar} />
                )}
              </div>
            )}
            <input
              className={classes.textFieldAva}
              onChange={this.onSelectImg}
              accept="image/*"
              name="avatar"
              type="file"
              style={{ cursor: 'pointer', opacity: 0, width: '300px', position: 'absolute', zIndex: '999', margin: '0px' }}
            />
            <span className={classes.spanAva}>
              <CameraAlt className={classes.iconCam} />
            </span>
            <Grid container justify="center">
              <span>???nh ?????i di???n</span>
            </Grid>
            <Grid container justify="center">
              <span>(Nh???p v??o ???nh ????? thay ?????i ???nh ?????i di???n)</span>
            </Grid>
          </Grid>
        </Grid>
        {expanded === 'panel4' ? (
          <Grid item md={12}>
            <Paper item md={12}>
              {value === 0 && (
                <TabContainer>
                  
                  <RoleByFunction
                    isGroup={false}
                    groupId={this.state.roleGroupSelectId || roleGroupsId}
                    employeeId={this.state.roleGroupSelectId || this.props.match.params.id || roleGroupsId}
                    allFunctionForAdd={this.state.allFunctionForAdd}
                    allowedDepartment={this.state.allowedDepartment}
                    fromAddUser
                    handleChangeRole={this.handleChangeRole}
                    id={this.props.match.params.id ? this.props.match.params.id : 'add'}
                  />
                </TabContainer>
              )}
              {value === 1 && (
                <TabContainer>
                  <DepartmentSelect
                    allowedDepartmentIds={this.state.allDepartment || []}
                    allowedDepartment={this.handleChangeRoles}
                    onChange={this.handleChangeAllowedDepart}
                    currentDepartment={this.state.organizationUnit} // phong ban moi
                    userDepartment={this.state.userDepartment} // phong ban cu
                    disabledAction
                    applyEmployeeOrgToModuleOrg={!this.state.applyEmployeeOrgToModuleOrg}
                    userRoles={this.state.departmentRoles || []}
                    requiredUserRoles
                  />
                </TabContainer>
              )}
            </Paper>
          </Grid>
        ) : null}
      </div>
    );
  }

  handleChangeAddedField = (index, e) => {
    const { fieldAdded } = this.state;
    const fields = [...fieldAdded];
    fieldAdded[index].value = e.target.value;
    this.setState({ fieldAdded: fields });
  };

  handleChangeValue = (event, value) => {
    this.setState({ value });
  };

  goBack = () => {
    this.state.user = null;
    localStorage.removeItem('user');
    this.props.history.goBack();
  };

  onSubmit = e => {
    const {
      admin,
      name,
      code,
      email,
      password,
      organizationUnit,
      rePassword,
      username,
      timeToJoin,
      IDcard,
      gender,
      address,
      dob,
      positions,
      note,
      mobileNumber,
      active,
      avatar,
      fieldAdded,
      listOrganizationUnit,
      allFunctionForAdd,
      type,
      resetChild,
      allowedDepartment,
      codeRoleGroupSelect,
      sip_uri,
      sip_password,
      isChangePwdRequired,
      resourcePortalUser,
      expiredDate,
      messages,
    } = this.state;
    let beginWork;
    // let dobDate;
    if (!timeToJoin) {
      // beginWork = new Date();
      beginWork = '';
    } else {
      beginWork = new Date(timeToJoin);
    }
    // if (dob === '') {
    //   dobDate = new Date();
    // } else {
    //   dobDate = new Date(dob);
    // }
    // this.state.gender = user.gender === 'male' ? 0 : 1;
    // this.state.gender = user.gender;

    const dobDate = new Date(dob).getTime();
    // const genderRaw = gender === 0 ? 'male' : 'female';
    const status = active ? 1 : 0;
    const others = {};
    if (fieldAdded.length > 0) {
      fieldAdded.forEach(item => {
        others[item.name.replace('others.', '')] = item.value;
      });
    }
    const depart = listOrganizationUnit.find(item => String(item.id) === String(organizationUnit));
    let organizationUnitRaw;
    if (depart) {
      organizationUnitRaw = {
        organizationUnitId: depart.id,
        name: depart.name,
      };
    }
    let body = {
      organizationUnit: organizationUnitRaw,
      admin,
      code,
      name,
      email,
      avatar,
      status,
      dob: dobDate,
      gender,
      // gender: genderRaw,
      IDcard,
      mobileNumber,
      address,
      note,
      userExtendViewConfig: this.state.userExtendViewConfig !== null ? this.state.userExtendViewConfig : undefined,
      positions,
      username,
      password,
      others,
      allFunctionForAdd,
      type,
      resetChild,
      allowedDepartment,
      roleGroupSource: codeRoleGroupSelect,
      sip_uri,
      sip_password,
      isChangePwdRequired,
      resourcePortalUser,
      expiredDate,
      beginWork,
    };

    this.props.onAddNewUser(body);
  };

  onEditBtn = () => {
    const rex = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let {
      admin,
      name,
      code,
      email,
      organizationUnit,
      timeToJoin,
      // id,
      IDcard,
      gender,
      address,
      dob,
      user,
      positions,
      note,
      mobileNumber,
      active,
      avatar,
      avatarURL,
      fieldAdded,
      listOrganizationUnit,
      allFunctionForAdd,
      type,
      resetChild,
      roleGroupSelectId,
      codeRoleGroupSelect,
      allowedDepartment,
      sip_uri,
      sip_password,
      expiredDate,
      resourcePortalUser,
      checkFirst,
    } = this.state;

    const { addUserPage } = this.props;

    if (name.length < 5 || code.length < 5) {
      if (name.length < 5) {
        this.setState({ errorName: true });
      }
      if (code.length < 5) {
        this.setState({ errorCode: true });
      }
    } else if (email && !rex.test(email.trim())) {
      this.setState({ errorEmail: true });
    } else {
      let beginWork;
      // let dobDate;
      if (!timeToJoin) {
        // beginWork = new Date();
        beginWork = '';
      } else {
        beginWork = new Date(timeToJoin);
      }
      // if (dob === '') {
      //   dobDate = new Date();
      // } else {
      //   dobDate = new Date(dob);
      // }

      const dobDate = new Date(dob).getTime();
      // const genderRaw = gender === 0 ? 'male' : 'female';
      const status = active ? 1 : 0;
      const others = {};
      if (fieldAdded.length > 0) {
        fieldAdded.forEach(item => {
          others[item.name.replace('others.', '')] = item.value;
        });
      }
      const depart = listOrganizationUnit.find(item => String(item.id) === String(organizationUnit));
      let organizationUnitRaw;
      if (depart) {
        organizationUnitRaw = {
          organizationUnitId: depart.id,
          name: depart.name,
        };
      }
      const childCodes = [
        'reportDebtReceivables',
        'reportDebtToPay',
        'reportDebtEmployees',
        'reportTopSalesCustomer',
        'reportTopSalesProduct',
        'reportMeetingCustomer',
        'reportsTaskStatus',
        'reportsBusinessOpportunities',
        'reportDoingTask',
        'reportCostRevenue',
        'reportCostPrice',
        'reportInventoryProduct',
        'reportRevenueInventory',
        'reportCostRatio',
        'reportCostRatioItem',
        'reportStatisticalReceipt',
        'reportCustomerNumberSell',
        'reportCustomerFrequencySell',
        'reportkpiSales',
        'reportsFinishLevel',
        'reportsEmployeeKpiSales',
        'reportStatsHrm',
        'reportbankBalance',
        'ReportFavoriteCostRatioYear',
        'reportBusinessSituation',
        'reportTopCustomerReceiptsMonth',
        'reportProgressTask',
        'reportIventoryByYear',
        'reportCustomerNumberSell',
        'reportCustomerFrequencySell',
        'reportMonthlySalesTarget',
        'reportAggregateRevenue',
        'ReportSalesEmployees',
        'reportInventoryByYear',
        'reportWeekTask',
        'reportTaskDebt',
        'reportTaskSummary',
        'reportContractValueAndPaid',
        'reportContractReported',
        'reportHrmCountByOrg',
        'reportHrmCountByContract',
        'reportHrmCountByAboutExpiredContract',
        'reportHrmCountBySignedContractDate',
        'reportHrmCountByLevel',
      ];

      const dataReport = allFunctionForAdd.filter(item => childCodes.includes(item.codeModleFunction)) || [];
      let data = {
        GET: false,
        POST: false,
        PUT: false,
        DELETE: false,
        EXPORT: false,
        IMPORT: false,
        VIEWCONFIG: false,
      };
      dataReport.map(el => {
        if (el.methods)
          el.methods.map(els => {
            for (const property in data) {
              if (els.name && els.name === property && els.allow === true) data[property] = true;
            }
          });
      });
      let roleReport = allFunctionForAdd.find(el => el.codeModleFunction === 'reports');

      roleReport &&
        roleReport.methods &&
        Array.isArray(roleReport.methods) &&
        roleReport.methods.length > 0 &&
        roleReport.methods.map(el => {
          for (const property in data) {
            if (data[property] === true) {
              if (el.name === property) {
                el.allow = data[property];
              }
            }
          }
        });
      const noRoleReport = allFunctionForAdd.filter(el => el.codeModleFunction !== 'reports') || [];
      allFunctionForAdd = [...noRoleReport, roleReport];
      let body = {
        organizationUnit: organizationUnitRaw,
        admin,
        code,
        name,
        email,
        // avatar: 'https://i.imgur.com/mnpT3wz.jpg',
        status,
        avatar,
        avatarURL,
        dob: dobDate,
        gender,
        // gender: genderRaw,
        IDcard,
        id: this.props.match.params.id,
        user: user.user,
        mobileNumber,
        address,
        note,
        userExtendViewConfig: this.state.userExtendViewConfig !== null ? this.state.userExtendViewConfig : undefined,
        positions,
        others,
        allFunctionForAdd,
        userId: addUserPage.user.userId,
        type,
        resetChild,
        roleGroupSelectId,
        roleGroupSource: codeRoleGroupSelect,
        allowedDepartment,
        sip_uri,
        sip_password,
        expiredDate,
        beginWork,
      };
      if (!checkFirst) {
        body = {
          ...body,
          resourcePortalUser,
        };
      }
      this.props.onEdit(body);
    }
  };

  handleChangeSelect = selectedOption => {
    this.setState({ organizationUnit: selectedOption });
  };
}

AddUserPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  onAddNewUser: PropTypes.func.isRequired,
  onResetNoti: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addUserPage: makeSelectAddUserPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onAddNewUser: body => {
      dispatch(addUserAction(body));
    },
    onGetOrganizationUnit: () => {
      dispatch(getDepartmentAct());
    },
    onResetNoti: () => {
      dispatch(resetNoti());
    },
    onEdit: body => {
      dispatch(editUserAct(body));
    },
    onGetUser: id => {
      dispatch(getUserAct(id));
    },
    onGetModule: () => {
      dispatch(getModuleAct());
    },
    mergeData: data => {
      dispatch(merge(data));
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addUserPage', reducer });
const withSaga = injectSaga({ key: 'addUserPage', saga });

export default compose(
  injectIntl,
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddUserPage);
