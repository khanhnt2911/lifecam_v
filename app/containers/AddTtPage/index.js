/**
 *
 * AddTtPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid, Typography, TextField, withStyles, Checkbox, Button } from '@material-ui/core';
import { Breadcrumbs } from '@material-ui/lab';
import { NavLink } from 'react-router-dom';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddTtPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getTemplateType, handleChange, postTemplateType, putTemplateType, mergeData } from './actions';
import { Autocomplete } from '../../components/LifetekUi';
import { viewConfigCheckForm, viewConfigCheckRequired } from '../../utils/common';
import dot from 'dot-object';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';

/* eslint-disable react/prefer-stateless-function */
const styles = {
  textField: {
    marginBottom: '25px',
    color: 'black',
  },
};

// const options = JSON.parse(localStorage.getItem('viewConfig')).map(item => ({ name: item.code, code: item.code }));
const options = [];
export class AddTtPage extends React.Component {
  constructor(props) {
    super(props);
    const moduleCode = 'TemplateType';
    const checkRequired = viewConfigCheckRequired(moduleCode, 'required');
    const checkShowForm = viewConfigCheckRequired(moduleCode, 'showForm');
    this.state = {
      templateColumns: JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'TemplateType').listDisplay.type.fields.type.columns,
      checkRequired,
      checkShowForm,
      localMessages: {},
      listModules: [],
      dataTest: []
    };
  }
  getMessages(props) {
    // const props = this.props.addSupplierPage;
    //console.log(this.props.addSupplierPage);
    // const attributes = {};
    // if (props.listAtt.length !== 0) {
    //   Object.keys(props.listAtt).forEach(item => {
    //     attributes[item] = this.props.addTtPage[item];
    //   });
    // }

    const data = {
      title: props.title,
      code: props.code,
      modules: props.modules,
      createdAt: props.createdAt,
      alwaysUsed: props.alwaysUsed,
    };
    const messages = viewConfigCheckForm(this.state.moduleCode, dot.dot(data));
    this.setState({
      localMessages: messages,
    });
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.getTemplateType(id);
    let options = JSON.parse(localStorage.getItem('viewConfig'))
    let allModules = JSON.parse(localStorage.getItem('allModules'))
    let arr = [];
    options.map(item => {
      arr.push({
        title:
          allModules && allModules[item.code] ? allModules[item.code].title : item.code,
        code: item.code,
      });
    });
    console.log(arr, "options")
    console.log(allModules, "options")

    this.setState({ listModules: arr || [] })
  }
  componentWillReceiveProps(props) {
    if (props.addTtPage.defaultState) {
      this.getMessages(props.addTtPage);
    } else {
      this.getMessages(this.props.addTtPage);
    }
  }
  saveTemplateType = () => {
    const id = this.props.match.params.id;
    const addTtPage = this.props.addTtPage;
    if (id === 'add') this.props.postTemplateType(addTtPage);
    else this.props.putTemplateType(id, addTtPage);
  };

  render() {

    const { classes, addTtPage } = this.props;
    const { localMessages, checkRequired, checkShowForm } = this.state;
    return (
      <div>
        <Helmet>
          <title>AddTtPage</title>
          <meta name="description" content="Description of AddTtPage" />
        </Helmet>
        <Grid container>
          <Grid item md={12}>
            <Breadcrumbs aria-label="Breadcrumb">
              <NavLink color="inherit" to="/">
                Dashboard
              </NavLink>
              <NavLink color="inherit" to="/setting/template_type">
                Lo???i v??n b???n
              </NavLink>
              <Typography color="textPrimary">Th??m m???i</Typography>
            </Breadcrumbs>
            <Typography style={{ marginBottom: '10px' }} variant="h5">
              Th??ng tin m???u v??n b???n
            </Typography>
            <TextField
              className={classes.textField}
              onChange={this.props.handleChange('title')}
              value={addTtPage.title}
              label="Ti??u ?????"
              fullWidth
              error={localMessages && localMessages.title || addTtPage.title === ''}
              helperText={localMessages && localMessages.title || (addTtPage.title === '' ? "Kh??ng ???????c ????? tr???ng Ti??u ?????" : null)}
              required={checkRequired.title}
              checkedShowForm={checkShowForm.title}
            />
            <TextField
              className={classes.textField}
              value={addTtPage.code}
              onChange={this.props.handleChange('code')}
              label="M??"
              fullWidth
              error={localMessages && localMessages.code || addTtPage.code === ''}
              helperText={localMessages && localMessages.code || (addTtPage.code === '' ? "Kh??ng ???????c ????? tr???ng M??" : null)}
              required={checkRequired.code}
              checkedShowForm={checkShowForm.code}
            />
            {/* <Autocomplete
              optionValue="code"
              optionLabel="title"
              select={this.props.select}
              value={this.state.dataTest}
              // value={addTtPage.modules}
              suggestions={this.state.listModules || []}
              isMulti
              fullWidth
              // onChange={this.props.handleChangeAutoComplete('modules')}
              onChange={e => this.setState({ dataTest: e })}
              label="Module" /> */}
            <Autocomplete
              isMulti
              name="Ch???n Module ... "
              label="Module"
              onChange={this.props.handleChangeAutoComplete('modules')}
              suggestions={this.state.listModules || []}
              value={addTtPage.modules}
              optionValue="code"
              optionLabel="title"
            />
            Lu??n s??? d???ng
            <Checkbox onChange={this.props.handleCheck('alwaysUsed')} checked={addTtPage.alwaysUsed} />
            <Grid item md={12}>
              <CustomGroupInputField
                code="TemplateType"
                columnPerRow={3}
                value={addTtPage.others}
                onChange={this.props.handleChangeAutoComplete('others')}
                // onChange={e => this.setState({ others: e })}
                noGrid={true}
              />
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '5px 10px' }}>
              <Button onClick={this.saveTemplateType} color="primary" variant="outlined">
                L??u
              </Button>
            </div>

          </Grid>
        </Grid>
      </div>
    );
  }
}

// AddTtPage.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  addTtPage: makeSelectAddTtPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleChange: name => e => dispatch(handleChange({ name, value: e.target.value })),
    handleChangeAutoComplete: name => e => dispatch(handleChange({ name, value: e })),

    handleCheck: name => e => dispatch(handleChange({ name, value: e.target.checked })),
    getTemplateType: id => dispatch(getTemplateType(id)),
    postTemplateType: data => dispatch(postTemplateType(data)),
    putTemplateType: (id, data) => dispatch(putTemplateType(id, data)),
    select: data => dispatch(mergeData({ modules: data })),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addTtPage', reducer });
const withSaga = injectSaga({ key: 'addTtPage', saga });

export default compose(
  withReducer,
  withSaga,
  withStyles(styles),
  withConnect,
)(AddTtPage);
