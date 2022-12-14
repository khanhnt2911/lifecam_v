/**
 *
 * EditPropertiesSet
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import styled from 'styled-components';
import {
  Paper,
  TextField,
  Grid,
  Button,
  Typography,
  FormHelperText,
  FormControl,
  FormControlLabel,
  Checkbox,
  AppBar,
  Toolbar,
  IconButton,
} from '@material-ui/core';
import { Edit, Menu, Close } from '@material-ui/icons';
import { DragDropContext } from 'react-beautiful-dnd';
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Column from '../../components/ColumnProperty';
import makeSelectEditPropertiesSet from './selectors';
import CustomAppBar from 'components/CustomAppBar';

import reducer from './reducer';
import saga from './saga';
import { fetchPropertiesGroupAct, fetchPropertiesAct, getPropertiesSetAct, editPropertiesSetAct, resetNoti } from './actions';
import messages from './messages';
import { injectIntl } from 'react-intl';
import './style.css';
const Container = styled.div`
  display: contents;
`;
/* eslint-disable react/prefer-stateless-function */
export class EditPropertiesSet extends React.Component {
  state = {
    id: 0,
    name: '',
    code: '',
    description: '',
    search: '',
    targetUseProperties: {
      customer: false,
      Product: false,
      Package: false,
      Supplier: false,
      Employees: false,
      Machines: false,
      KCS: false,
    },

    tasks: [
      {
        id: '0',
        content: '',
        subItems: [],
      },
    ],
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To do',
        taskIds: [],
      },
      'column-2': {
        id: 'column-2',
        title: 'In progress',
        taskIds: ['0'],
      },
    },
    // Facilitate reordering of the columns
    columnOrder: ['column-1', 'column-2'],
    item: [],

    errorName: false,
    errorCode: false,
    currentSet: null,
  };

  componentWillMount() {
    const { match } = this.props;
    this.props.onGetPropertiesSet(match.params.id);
    this.props.onGetProperties();
    this.props.onGetPropertiesGroup();
  }

  // componentDidMount() {
  //   const { addPropertiesSet } = this.props;
  //   console.log(addPropertiesSet);
  // }

  componentDidUpdate() {
    const { editPropertiesSet } = this.props;
    if (editPropertiesSet.successEdit) {
      this.props.enqueueSnackbar('Thao t??c th??nh c??ng!', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      this.props.history.value = 0;
      this.props.history.push('/setting/properties');
      this.props.onResetNoti();
    }
    if (editPropertiesSet.error) {
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

  componentWillReceiveProps(props) {
    // console.log(this.state.tasks);
    if (props !== this.props) {
      const { editPropertiesSet } = props;
      if (editPropertiesSet.currentSet) {
        const { currentSet } = editPropertiesSet;
        this.setState({
          code: currentSet.code,
          name: currentSet.name,
          description: currentSet.describe,
          targetUseProperties: currentSet.objects,
          currentSet,
        });

        this.state.tasks = [
          {
            id: '0',
            content: '',
            subItems: [],
          },
        ];
        this.state.columns['column-1'].taskIds = [];
        if (
          editPropertiesSet.propertiesList &&
          // this.state.tasks[0].subItems.length === 0 &&
          this.state.columns['column-1'].taskIds.length === 0 &&
          this.state.tasks.length === 1 &&
          editPropertiesSet.propertiesGroup
        ) {
          const listPropsinUse = [];
          const groupInUse = [];
          const listProps = [];
          currentSet.attributeGroups.forEach(group => {
            const attr = [];
            group.attributes.forEach(item => {
              attr.push({
                id: item.attributeId,
                content: `($${item.code}) ${item.name}`,
                name: item.name,
                code: item.code,
              });
              listPropsinUse.push(item.attributeId);
            });
            groupInUse.push({
              id: group.attributeGroupId,
              content: `${group.name}`,
              subItems: attr,
            });
          });
          editPropertiesSet.propertiesList.forEach(item => {
            listProps.push({
              id: item.id,
              content: `($${item.code}) ${item.name}`,
              name: item.name,
              code: item.code,
            });
          });
          listPropsinUse.forEach(item => {
            listProps.forEach((prop, index) => {
              if (item === prop.id) {
                listProps.splice(index, 1);
              }
            });
          });
          this.state.tasks['0'].subItems = listProps;
          if (editPropertiesSet.propertiesGroup) {
            const group = [];
            const groupRaw = [];
            editPropertiesSet.propertiesGroup.forEach(item => {
              group.push({
                id: item.id,
                content: `${item.name}`,
                subItems: [],
              });
            });
            groupInUse.forEach(item => {
              group.forEach((prop, index) => {
                if (item.id === prop.id) {
                  group.splice(index, 1);
                }
              });
            });

            groupRaw.push(this.state.tasks[0]);
            group.forEach(item => {
              groupInUse.push(item);
            });
            groupInUse.unshift(this.state.tasks[0]);
            this.state.tasks = groupInUse;
            // console.log(this.state.tasks);
            this.state.tasks.forEach(n => {
              if (n.id !== '0') {
                this.state.columns['column-1'].taskIds.push(n.id);
              }
            });
          }
          this.state.item = this.state.tasks[0].subItems;
        }
      }
    }
  }

  render() {
    const { intl } = this.props;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    /* eslint-disable */
    this.state.tasks[0].subItems = this.state.item.filter(i => {
      // console.log(i)
      if (this.state.search === '') return true;
      if (i.content.toLocaleLowerCase().indexOf(this.state.search.toLocaleLowerCase()) > -1) return true;
    });
    // console.log('item', this.state.item)
    /* eslint-enable */
    return (
      <div>
        <CustomAppBar
          title={
            addStock === 'propertiesSet'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'th??m m???i b???? thu????c ti??nh' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'C???p nh???t b???? thu????c ti??nh' })}`
          }
          onGoBack={this.goBack}
          onSubmit={this.onEdit}
        />
        <Helmet>
          <title>EditPropertiesSet</title>
          <meta name="description" content="Description of EditPropertiesSet" />
        </Helmet>
        {/* <Paper style={{ padding: 20, marginBottom: '20px' }}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/setting/properties">
              Thu???c t??nh
            </Link>
            {this.state.id === 0 ? (
              <Typography color="textPrimary">Th??m m???i b??? thu???c t??nh</Typography>
            ) : (
                <Typography color="textPrimary">S???a nh??m thu???c t??nh</Typography>
              )}
          </Breadcrumbs>
        </Paper> */}
        <Paper style={{ padding: 20 }}>
          <Grid item container md={12} spacing={32}>
            <Grid item md={6}>
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '18px',
                }}
              >
                <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Th??ng tin c?? b???n b??? thu???c t??nh{' '}
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
              <FormControl style={{ width: '100%', margin: '10px auto' }}>
                <TextField
                  label="T??n b??? thu???c t??nh *"
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
              <FormControl style={{ width: '100%', margin: '10px auto' }}>
                <TextField
                  label="M?? b??? thu???c t??nh *"
                  value={this.state.code}
                  name="code"
                  // disabled={this.state.currentSet !== null}
                  onChange={this.handleChange}
                  // style={{ width: '100%', margin: '10px auto' }}
                />
                {this.state.errorCode ? (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Kh??ng ???????c ????? tr???ng m??
                  </FormHelperText>
                ) : (
                  ''
                )}
              </FormControl>
              <TextField
                label="M?? t???"
                value={this.state.description}
                name="description"
                onChange={this.handleChange}
                style={{ width: '100%', margin: '10px auto' }}
                multiline
                rows={4}
              />
              {/* <Button onClick={this.goBack} variant="contained" color="primary" style={{ marginTop: 20 }}>
                Quay l???i
              </Button> */}
              &nbsp;
              {/* <Button variant="contained" color="primary" style={{ marginTop: 20 }} onClick={this.onEdit}>
                L??u
              </Button> */}
            </Grid>
            <Grid item md={6}>
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '18px',
                }}
              >
                ?????i t?????ng s??? d???ng b??? thu???c t??nh
              </Typography>
              <FormControlLabel
                style={{ display: 'flex' }}
                control={
                  <Checkbox
                    checked={this.state.targetUseProperties.customer}
                    onChange={this.handleChangeCheckbox('customer')}
                    value="customer"
                    color="primary"
                  />
                }
                label="Kh??ch h??ng"
              />
              <FormControlLabel
                style={{ display: 'flex' }}
                control={
                  <Checkbox
                    checked={this.state.targetUseProperties.Product}
                    onChange={this.handleChangeCheckbox('Product')}
                    value="Product"
                    color="primary"
                  />
                }
                label="S???n ph???m"
              />
              <FormControlLabel
                style={{ display: 'flex' }}
                control={
                  <Checkbox
                    checked={this.state.targetUseProperties.Package}
                    onChange={this.handleChangeCheckbox('Package')}
                    value="Package"
                    color="primary"
                  />
                }
                label="G??i s???n ph???m"
              />
              <FormControlLabel
                style={{ display: 'flex' }}
                control={
                  <Checkbox
                    checked={this.state.targetUseProperties.Supplier}
                    onChange={this.handleChangeCheckbox('Supplier')}
                    value="Supplier"
                    color="primary"
                  />
                }
                label="Nh?? cung c???p"
              />
              <FormControlLabel
                style={{ display: 'flex' }}
                control={
                  <Checkbox
                    checked={this.state.targetUseProperties.Employees}
                    onChange={this.handleChangeCheckbox('Employees')}
                    value="Employees"
                    color="primary"
                  />
                }
                label="Nh??n vi??n"
              />
              <FormControlLabel
                style={{ display: 'flex' }}
                control={
                  <Checkbox
                    checked={this.state.targetUseProperties.Machines}
                    onChange={this.handleChangeCheckbox('Machines')}
                    value="Machines"
                    color="primary"
                  />
                }
                label="M??y m??c"
              />
              <FormControlLabel
                style={{ display: 'flex' }}
                control={
                  <Checkbox checked={this.state.targetUseProperties.KCS} onChange={this.handleChangeCheckbox('KCS')} value="KCS" color="primary" />
                }
                label="KCS"
              />
            </Grid>
          </Grid>
          <Grid item md={12} container direction="column">
            <Typography
              component="p"
              style={{
                fontWeight: 550,
                fontSize: '18px',
                marginTop: 50,
                display: 'block',
              }}
            >
              Gh??p nh??m thu???c t??nh
            </Typography>
            <Typography
              component="p"
              style={{
                fontSize: '13px',
                fontStyle: 'italic',
                display: 'block',
              }}
            >
              K??o th??? t???ng thu???c t??nh v??o nh??m thu???c t??nh
            </Typography>
            <Grid item md={12} container spacing={24}>
              <Grid item md={6}>
                <Typography
                  component="p"
                  style={{
                    fontWeight: 550,
                    fontSize: '18px',
                    marginLeft: 10,
                    marginTop: 20,
                  }}
                >
                  <Menu style={{ fontSize: '20px', marginBottom: '5px' }} /> Th??ng tin B??? thu???c t??nh
                </Typography>
              </Grid>
              <Grid item md={6}>
                <Typography
                  component="p"
                  style={{
                    fontWeight: 550,
                    fontSize: '18px',
                    marginLeft: 10,
                    display: 'inline-block',
                    marginTop: 20,
                  }}
                >
                  <Menu style={{ fontSize: '20px', marginBottom: '5px' }} /> T???t c??? thu???c t??nh
                </Typography>
                <TextField
                  label="T??m ki???m"
                  value={this.state.search}
                  variant="outlined"
                  style={{ marginLeft: 20 }}
                  name="search"
                  onChange={this.handleChange}
                />
              </Grid>
            </Grid>
            {this.state.columns['column-1'].taskIds.length > 0 ? (
              <Grid item md={12} container>
                <DragDropContext onDragEnd={this.onDragEnd}>
                  <Container item md={12}>
                    {this.state.columnOrder.map(columnId => {
                      const column = this.state.columns[columnId];
                      const tasks = [];

                      column.taskIds.forEach(item => {
                        this.state.tasks.forEach(task => {
                          if (task.id === item) {
                            tasks.push(task);
                          }
                        });
                      });

                      return <Column style={{ widh: '400px' }} key={column.id} column={column} tasks={tasks} />;
                    })}
                  </Container>
                </DragDropContext>
              </Grid>
            ) : (
              ''
            )}
          </Grid>
        </Paper>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }

  goBack = () => {
    this.props.history.value = 0;
    this.props.history.push('/setting/properties');
  };

  onEdit = () => {
    const attributeGroups = [];
    const { tasks, name, code, description, targetUseProperties, currentSet } = this.state;
    tasks.forEach(item => {
      if (item.id !== '0' && item.subItems.length > 0) {
        const attributes = [];
        item.subItems.forEach(subItem => {
          attributes.push({
            name: subItem.name,
            attributeId: subItem.id,
          });
        });
        attributeGroups.push({
          name: item.content,
          attributeGroupId: item.id,
          attributes,
        });
      }
    });
    const body = {
      attributeGroups,
      name,
      code: code.trim(),
      describe: description,
      objects: targetUseProperties,
    };
    if (name === '' || code === '') {
      if (name === '') {
        this.setState({ errorName: true });
      }
      if (code === '') {
        this.setState({ errorCode: true });
      }
    } else {
      this.props.onEdit({ body, id: currentSet.id });
    }
    // this.state.tasks.forEach
  };

  handleChange = e => {
    if (e.target.name === 'name' || e.target.name === 'code') {
      if (e.target.name === 'name') {
        this.setState({ errorName: false });
      }
      if (e.target.name === 'code') {
        this.setState({ errorCode: false });
      }
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChangeCheckbox = name => event => {
    const { targetUseProperties } = this.state;
    const target = targetUseProperties;
    /* eslint-enable */
    target[name] = event.target.checked;
    this.setState({ targetUseProperties: target });
  };

  onDragEnd = result => {
    const { destination, source, type, draggableId } = result;
    const { tasks } = this.state;
    /* eslint-disable */
    if (type === 'droppableSubItem') {
      if (!result.destination) {
        return;
      }
      // const sourceIndex = result.source.index;
      // const destIndex = result.destination.index;
      const indexFrom = this.state.tasks[0].subItems.findIndex(item => {
        if (result.draggableId === item.id) return true;
      });
      if (indexFrom >= 0) {
        const indexTo = this.state.tasks.findIndex(item => {
          if (destination.droppableId === item.id) return true;
        });
        const currentItem = this.state.tasks[0].subItems[indexFrom];
        tasks[0].subItems.splice(indexFrom, 1);
        // tasks[indexTo].subItems.push(currentItem);
        tasks[indexTo].subItems.splice(destination.index, 0, currentItem);
      }
      if (indexFrom < 0) {
        const indexFr = this.state.tasks.findIndex(item => {
          if (destination.droppableId == item.id) return true;
        });
        if (indexFr < 0) {
          const indexFrom = this.state.tasks.findIndex(item => {
            if (source.droppableId === item.id) return true;
          });
          const currentItem = this.state.tasks[indexFrom].subItems.find(n => {
            if (n.id === draggableId) return true;
          });
          tasks[indexFrom].subItems.splice(source.index, 1);
          tasks[0].subItems.push(currentItem);
          tasks[0].subItems.splice(destination.index, 0, currentItem);
        } else {
          const indexFrom = this.state.tasks.findIndex(item => {
            if (source.droppableId === item.id) return true;
          });
          const currentItem = this.state.tasks[indexFrom].subItems.find(n => {
            if (n.id === draggableId) return true;
          });
          tasks[indexFrom].subItems.splice(source.index, 1);
          // tasks[indexFr].subItems.push(currentItem);
          tasks[indexFr].subItems.splice(destination.index, 0, currentItem);
        }
      }
      this.setState({ item: tasks[0].subItems });
      // tasks[0].subItems.splice(parseInt(index.id, 10), 1);
    }
    /* eslint-enable */
  };
}

EditPropertiesSet.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  editPropertiesSet: makeSelectEditPropertiesSet(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetPropertiesGroup: () => {
      dispatch(fetchPropertiesGroupAct());
    },
    onGetProperties: () => {
      dispatch(fetchPropertiesAct());
    },
    onGetPropertiesSet: id => {
      dispatch(getPropertiesSetAct(id));
    },
    onEdit: body => {
      dispatch(editPropertiesSetAct(body));
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

const withReducer = injectReducer({ key: 'editPropertiesSet', reducer });
const withSaga = injectSaga({ key: 'editPropertiesSet', saga });

export default compose(
  injectIntl,
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
)(EditPropertiesSet);
