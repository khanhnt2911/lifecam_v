/**
 *
 * AddSmsCampaign
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid, Button, MenuItem, Checkbox, AppBar, Toolbar, IconButton } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import Buttons from 'components/CustomButtons/Button';
import { Add, Close } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { injectIntl } from 'react-intl';
import messages from './messages';
import './style.css';
import { TextField, Paper, Typography, Autocomplete, AsyncAutocomplete } from 'components/LifetekUi';
import { API_CUSTOMERS } from '../../config/urlConfig';
import makeSelectAddSmsCampaign from './selectors';
import { mergeData, getData, postCampaign, putCampaign } from './actions';
import reducer from './reducer';
import saga from './saga';
import { CUSTOMER_TYPE_CODE } from '../../utils/constants';

const {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  OrderedList,
  UnorderedList,
  Undo,
  Redo,
  FontSize,
  FontName,
  FormatBlock,
  Link,
  Unlink,
  InsertImage,
  ViewHtml,
  InsertTable,
  AddRowBefore,
  AddRowAfter,
  AddColumnBefore,
  AddColumnAfter,
  DeleteRow,
  DeleteColumn,
  DeleteTable,
  MergeCells,
  SplitCell,
} = EditorTools;
/* eslint-disable react/prefer-stateless-function */
export class AddSmsCampaign extends React.Component {
  state = { tab: 0 };

  componentDidMount = () => {
    this.props.getData();
  };

  handleTab(tab) {
    this.setState({ tab });
  }

  handleDateChange = value => {
    this.props.mergeData({ timer: value });
  };

  handleSendChange = e => {
    this.props.mergeData({ sender: e.target.value });
  };

  handleFormOnchnge = value => {
    this.props.mergeData({ form: value });
    this.setHtml(value.content);
  };

  setHtml = value => {
    EditorUtils.setHtml(this.editor.view, value);
  };

  addItem = code => {
    const dataRenderLocal = JSON.parse(localStorage.getItem('crmSource')) || null;
    const dataRender = dataRenderLocal ? dataRenderLocal.find(item => item.code === code) : null;
    if (dataRender) return dataRender.data;
    return [];
  };

  render() {
    const { tab } = this.state;
    const { addSmsCampaign, onCloseAdd } = this.props;
    const { selectedDate, minute, active, templates } = addSmsCampaign;
    const Bt = props => (
      <Buttons onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : ''} left round size="md">
        {props.children}
      </Buttons>
    );
    return (
      <div style={{ width: 'calc(100vw - 260px)' }}>
        <AppBar className="HearderappBarSMSCampaign">
          <Toolbar>
            <IconButton
              color="inherit"
              variant="contained"
              // onClick={() => this.props.propsAll.history.goBack()}
              onClick={onCloseAdd ? onCloseAdd : () => this.props.propsAll.history.goBack()}
              aria-label="Close"
            >
              <Close />
            </IconButton>
            <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
              {this.props.id === 'add' ? (
                <p variant="h6" style={{ color: 'white', marginBottom: 0 }}>
                  TH??M M???I
                </p>
              ) : (
                <p variant="h6" style={{ color: 'white', marginBottom: 0 }}>
                  C???P NH???T
                </p>
              )}
            </Typography>
            <Button variant="outlined" color="inherit" onClick={this.onSave}>
              L??U
            </Button>
          </Toolbar>
        </AppBar>
        <Paper>
          <Grid container>
            <h4 style={{ fontWeight: 'bold', display: 'inline' }}>
              <Add />
              Th??m m???i chi???n d???ch Sms
            </h4>{' '}
            <Grid item md={12}>
              <TextField
                label="T??n chi???n d???ch"
                value={addSmsCampaign.name}
                onChange={e => this.props.mergeData({ name: e.target.value })}
                fullWidth
              />
              <TextField select label="?????u s??? g???i" name="sender" value={addSmsCampaign.sender} onChange={this.handleSendChange} fullWidth>
                <MenuItem key="0" value={0}>
                  G???i b???ng BrandName
                </MenuItem>
                <MenuItem key="1" value={1}>
                  G???i b???ng s??? ??i???n tho???i
                </MenuItem>
              </TextField>
              <Typography>Ng?????i nh???n</Typography>
              {addSmsCampaign.selectAll === false ? (
                <div>
                  <div style={{ width: '100%' }}>
                    <Autocomplete
                      isMulti
                      name="Ch???n... "
                      label="Nh??m kh??ch h??ng"
                      onChange={value => this.props.mergeData({ receiver: value })}
                      value={addSmsCampaign.receiver.groupCustomer}
                      suggestions={this.addItem('S07')}
                      optionLabel="title"
                      optionValue="value"
                    />
                  </div>{' '}
                  <div style={{ width: '100%' }}>
                    <Autocomplete
                      isMulti
                      name="Ch???n... "
                      label="Lo???i kh??ch h??ng"
                      suggestions={this.addItem(CUSTOMER_TYPE_CODE)}
                      onChange={value => this.props.mergeData({ receiver: value })}
                      value={addSmsCampaign.receiver.typeCustomer}
                      optionLabel="title"
                      optionValue="value"
                    />
                  </div>
                  <div style={{ width: '100%' }}>
                    <AsyncAutocomplete
                      isMulti
                      name="Ch???n..."
                      label="Kh??ch h??ng"
                      onChange={value => this.props.mergeData({ receiver: value })}
                      url={API_CUSTOMERS}
                      value={addSmsCampaign.receiver.customer}
                    />
                  </div>
                </div>
              ) : null}
              <div style={{ padding: 10 }}>
                G???i cho t???t c??? kh??ch h??ng
                <Checkbox color="primary" checked={addSmsCampaign.selectAll} onChange={e => this.props.mergeData({ selectAll: e.target.checked })} />
              </div>
              <Autocomplete
                label="Bi???u m???u SMS"
                name="form"
                fullWidth
                optionLabel="title"
                suggestions={templates}
                value={addSmsCampaign.form}
                onChange={value => this.handleFormOnchnge(value)}
              />
              <TextField
                label="Ti??u ????? SMS"
                name="title"
                fullWidth
                value={addSmsCampaign.title}
                onChange={e => this.props.mergeData({ title: e.target.value })}
              />
              <h4>N???i dung SMS</h4>
              <Editor
                tools={[
                  [Bold, Italic, Underline, Strikethrough],
                  [Subscript, Superscript],
                  [AlignLeft, AlignCenter, AlignRight, AlignJustify],
                  [Indent, Outdent],
                  [OrderedList, UnorderedList],
                  FontSize,
                  FontName,
                  FormatBlock,
                  [Undo, Redo],
                  [Link, Unlink, InsertImage, ViewHtml],
                  [InsertTable],
                  [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                  [DeleteRow, DeleteColumn, DeleteTable],
                  [MergeCells, SplitCell],
                ]}
                contentStyle={{ height: 200 }}
                contentElement={addSmsCampaign.content}
                ref={editor => (this.editor = editor)}
              />
              <Typography>C??i ?????t th???i gian chi???n d???ch</Typography>
              <div>
                <Bt tab={0}>H???n gi???</Bt>
                <Bt tab={1}>L???p l???i sau n ph??t</Bt>
                <Bt tab={2}>H??ng ng??y</Bt>
                <Bt tab={3}>H??ng th??ng</Bt>
                <Bt tab={4}>T??y ch???nh</Bt>
                {tab === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DateTimePicker
                        inputVariant="outlined"
                        format="DD/MM/YYYY HH:mm"
                        value={selectedDate}
                        onChange={value => this.handleDateChange(value)}
                        name="timer"
                        variant="outlined"
                        label="Th???i gian"
                        margin="dense"
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                ) : null}
                {tab === 1 ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>L???p l???i</Typography>
                    <TextField
                      variant="outlined"
                      onChange={e => this.props.mergeData({ minute: e.target.value })}
                      name="minute"
                      type="number"
                      value={minute}
                      style={{ width: 150 }}
                    />
                    <Typography>ph??t m???t l???n</Typography>
                  </div>
                ) : null}
                {tab === 2 ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>L???p l???i m???i ng??y v??o l??c:</Typography>
                    <TextField
                      variant="outlined"
                      onChange={e => this.props.mergeData({ hours: e.target.value })}
                      type="number"
                      value={addSmsCampaign.hours}
                      style={{ width: 150 }}
                    />
                    <Typography>gi???</Typography>
                    <TextField
                      variant="outlined"
                      onChange={e => this.props.mergeData({ minute: e.target.value })}
                      type="number"
                      value={minute}
                      style={{ width: 150 }}
                    />
                    <Typography>ph??t</Typography>
                  </div>
                ) : null}
                {tab === 3 ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>L???p l???i m???i th??ng v??o ng??y:</Typography>
                    <TextField
                      variant="outlined"
                      onChange={e => this.props.mergeData({ day: e.target.value })}
                      type="number"
                      value={addSmsCampaign.day}
                      style={{ width: 150 }}
                    />
                    <Typography>l??c</Typography>
                    <TextField
                      variant="outlined"
                      onChange={e => this.props.mergeData({ hours: e.target.value })}
                      type="number"
                      value={addSmsCampaign.hours}
                      style={{ width: 150 }}
                    />
                    <Typography>gi???</Typography>
                    <TextField
                      variant="outlined"
                      onChange={e => this.props.mergeData({ minute: e.target.value })}
                      type="number"
                      value={minute}
                      style={{ width: 150 }}
                    />
                    <Typography>ph??t</Typography>
                  </div>
                ) : null}
              </div>
              K??ch ho???t chi???n d???ch
              <Checkbox color="primary" checked={active} onChange={e => this.props.mergeData({ active: e.target.checked })} />
              {/* <div>
                <Button
                  type="submit"
                  style={{ float: 'right', padding: '5px', margin: '5px' }}
                  color="primary"
                  variant="outlined"
                  onClick={this.onSave}
                >
                  Th???c hi???n
                </Button>
              </div> */}
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }

  onSave = () => {
    const view = this.editor.view;
    const { addSmsCampaign } = this.props;
    const data = {
      name: addSmsCampaign.name,
      sender: addSmsCampaign.sender,
      senderName: addSmsCampaign.senderName,
      receiver: addSmsCampaign.receiver,
      form: addSmsCampaign.form,
      title: addSmsCampaign.title,
      content: EditorUtils.getHtml(view.state),
      formType: 'sms',
    };
    this.props.postCampaign(data);
  };
}
AddSmsCampaign.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addSmsCampaign: makeSelectAddSmsCampaign(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getData: () => dispatch(getData()),
    postCampaign: data => dispatch(postCampaign(data)),
    putCampaign: (data, id) => dispatch(putCampaign(data, id)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addSmsCampaign', reducer });
const withSaga = injectSaga({ key: 'addSmsCampaign', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(AddSmsCampaign);
