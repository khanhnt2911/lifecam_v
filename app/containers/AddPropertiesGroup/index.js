/**
 *
 * AddPropertiesGroup
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Paper, TextField, Grid, Button, Typography, FormHelperText, FormControl,AppBar, Toolbar, IconButton } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import { Edit, Close } from '@material-ui/icons';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddPropertiesGroup from './selectors';
import reducer from './reducer';
import saga from './saga';
import { fetchPropertiesGroupAct, resetNoti, createPropertiesGroupAct, editPropertiesGroupAct } from './actions';
import messages from './messages';
import "./style.css"
import CustomAppBar from 'components/CustomAppBar';

/* eslint-disable react/prefer-stateless-function */
export class AddPropertiesGroup extends React.Component {
  state = {
    name: '',
    sortOrder: 0,
    description: '',
    currentProp: null,

    errorName: false,
  };

  componentWillMount() {
    this.props.onGetPropertiesGroup();
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      this.props.onResetNoti();
      const { addPropertiesGroup, match } = props;
      let info;
      if (addPropertiesGroup.propertiesGroup) {
        info = addPropertiesGroup.propertiesGroup.find(n => {
          if (n.id === match.params.id) return true;
          return false;
        });
        // console.log(info);
        if (match.params.id !== '0') {
          this.setState({
            name: info.name,
            sortOrder: info.order,
            description: info.describe,
            currentProp: info,
          });
        }
        this.props.onResetNoti();
      }
    }
  }

  componentDidUpdate() {
    const { addPropertiesGroup } = this.props;
    if (addPropertiesGroup.successCreate) {
      this.props.enqueueSnackbar('Thao t??c th??nh c??ng!', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      this.props.history.value = 1;
      this.props.history.push('/setting/properties');
      this.props.onResetNoti();
    }
    if (addPropertiesGroup.error) {
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

  render() {
    const { currentProp } = this.state;
    const { intl } = this.props;
    const id = this.props.match.params.id;
    return (
      <div>
             <CustomAppBar
              title= {id === "0"
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'th??m m???i nho??m thu????c ti??nh' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'C???p nh???t nho??m thu????c ti??nh' })}`}
              onGoBack={this.goBack}
              onSubmit={id === "0" ? this.handleSubmit : this.handleEdit}
            />
        <Helmet>
          {currentProp === null ? <title>Th??m m???i nh??m thu???c t??nh</title> : <title>S???a nh??m thu???c t??nh</title>}
          <meta name="description" content="Description of AddPropertiesGroup" />
        </Helmet>
        {/* <Paper style={{ padding: 20, marginBottom: '20px' }}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/setting/properties">
              Thu???c t??nh
            </Link>
            {currentProp === null ? (
              <Typography color="textPrimary">Th??m m???i nh??m thu???c t??nh</Typography>
            ) : (
              <Typography color="textPrimary">S???a nh??m thu???c t??nh</Typography>
            )}
          </Breadcrumbs>
        </Paper> */}
        <Paper style={{ padding: 20 }}>
          <Typography
            component="p"
            style={{
              fontWeight: 550,
              fontSize: '18px',
            }}
          >
            <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Th??ng tin c?? b???n nh??m thu???c t??nh{' '}
            <span
              style={{
                color: '#A4A4A4',
                fontStyle: 'italic',
                fontWeight: 500,
              }}
            >
              C??c tr?????ng c?? d???u * l?? c???n nh???p
            </span>
          </Typography>
          <Grid item md={12}>
            <FormControl style={{ width: '100%', margin: '10px auto' }}>
              <TextField
                label="T??n nh??m thu???c t??nh *"
                value={this.state.name}
                name="name"
                onChange={this.handleChange}
                // style={{ width: '100%', margin: '10px auto' }}
              />
              {this.state.errorName ? (
                <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                  Kh??ng ???????c ????? tr???ng t??n
                </FormHelperText>
              ) : (
                ''
              )}
            </FormControl>
            <TextField
              label="Th??? t??? s???p x???p"
              value={this.state.sortOrder}
              name="sortOrder"
              onChange={this.handleChange}
              style={{ width: '100%', margin: '10px auto' }}
            />
            <TextField
              label="M?? t???"
              value={this.state.description}
              name="description"
              onChange={this.handleChange}
              style={{ width: '100%', margin: '10px auto' }}
              multiline
              rows={4}
            />
            {/* <Button onClick={this.goBack} variant="contained" color="primary">
              Quay l???i
            </Button> */}
            &nbsp;
            {/* {currentProp === null ? (
              <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                L??u
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={this.handleEdit}>
                L??u
              </Button>
            )} */}
          </Grid>
        </Paper>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }

  goBack = () => {
    this.props.history.value = 1;
    this.props.history.push('/setting/properties');
  };

  handleChange = e => {
    if (e.target.name === 'name') {
      if (e.target.name === 'name') {
        this.setState({ errorName: false });
      }
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = () => {
    const { name, sortOrder, description } = this.state;
    if (name === '') {
      this.setState({ errorName: true });
    } else {
      const body = {
        name,
        order: sortOrder,
        describe: description,
      };
      this.props.onCreatePropertiesGroup(body);
    }
  };

  handleEdit = () => {
    const { name, sortOrder, description } = this.state;
    if (name === '') {
      this.setState({ errorName: true });
    } else {
      const body = {
        id: this.state.currentProp.id,
        name,
        order: sortOrder,
        describe: description,
      };
      this.props.onEditPropertiesGroup(body);
    }
  };
}

AddPropertiesGroup.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addPropertiesGroup: makeSelectAddPropertiesGroup(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetPropertiesGroup: () => {
      dispatch(fetchPropertiesGroupAct());
    },
    onCreatePropertiesGroup: data => {
      dispatch(createPropertiesGroupAct(data));
    },
    onEditPropertiesGroup: data => {
      dispatch(editPropertiesGroupAct(data));
    },
    onResetNoti: () => {
      dispatch(resetNoti());
    },
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addPropertiesGroup', reducer });
const withSaga = injectSaga({ key: 'addPropertiesGroup', saga });

export default compose(
  injectIntl,
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
)(AddPropertiesGroup);
