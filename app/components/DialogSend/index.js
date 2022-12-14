/* eslint-disable no-underscore-dangle */
/**
 *
 * DialogSend
 *
 */

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Typography, IconButton, Button, Dialog, Radio } from '@material-ui/core';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { Close } from '@material-ui/icons';
import _ from 'lodash';
import AsyncSelect from '../AsyncComponent';
import { API_USERS } from '../../config/urlConfig';
import './style.scss';
// import { da } from 'date-fns/locale';

/* eslint-disable react/prefer-stateless-function */

// Select

// const filter = (inputValue: string) =>
//   data.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()));

// const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' },
// ];
const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <Close />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);

class DialogSend extends React.Component {
  state = {
    open: false,
    toUsers: [],
    superVision: '',
  };

  handleChangeRadio = event => {
    this.setState({ selectedValue: event.target.value });
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChangeSelect = (selectedOption, key) => {
    const { data } = this.state;
    data[key].name = selectedOption.value;
    this.setState({});
  };

  render() {
    let { toUsers, superVision } = this.state;
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen} style={{ margin: '20px 0px', float: 'right' }}>
          Chuy???n ti???p
        </Button>

        <Dialog onClose={this.handleClose} fullWidth maxWidth="sm" open={this.state.open} aria-labelledby="scroll-dialog-title">
          <DialogTitle id="scroll-dialog-title">B??n giao c??ng v??n</DialogTitle>
          <DialogContent style={{ height: '400px' }}>
            <div className="marginSelect">
              <Typography style={{ paddingBottom: '10px' }}>Ch???n c?? nh??n, ????n v??? nh???n c??ng v??n</Typography>
              <AsyncSelect
                onChange={value => {
                  toUsers = value;
                  this.setState({ toUsers });
                }}
                value={toUsers}
                placeholder="Ng?????i nh???n"
                API={API_USERS}
                modelName="Employee"
                isMulti
                noFormatValue
              />
            </div>
            {/*
            <div className="marginSelect">
              <Typography style={{ paddingBottom: '10px' }}>
                Ch???n ph??ng ban nh???n c??ng v??n
              </Typography>
              <Select
                defaultValue={colourOptions[1]}
                options={groupedOptions}
                components={{ Menu }}
              />
            </div> */}
            <div className="marginSelect">
              <Typography style={{ paddingBottom: '10px' }}>Ch???n ng?????i theo d??i</Typography>
              <AsyncSelect
                onChange={value => {
                  superVision = value;
                  this.setState({ superVision });
                }}
                value={superVision}
                placeholder="Ng?????i theo d??i"
                API={API_USERS}
                modelName="Employee"
                isMulti
                noFormatValue
              />
            </div>
            <div>
              <Radio
                checked={this.state.selectedValue === 'a'}
                onChange={this.handleChangeRadio}
                value="a"
                name="radio-button-demo"
                aria-label="A"
                color="primary"
              />
              <span>Nh???n x??? l??</span>
              <Radio
                checked={this.state.selectedValue === 'b'}
                onChange={this.handleChangeRadio}
                value="b"
                name="radio-button-demo"
                aria-label="B"
                color="primary"
              />
              <span>Nh???n c??ng v??n</span>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              variant='outlined'
              onClick={() => {
                const newDocumentary = Object.assign({}, this.props.documentary);
                const x = toUsers.map(user => user._id);
                // console.log(x, newDocumentary.toUsers);
                newDocumentary.toUsers = _.uniq([...newDocumentary.toUsers, ...x]);
                newDocumentary.type = '1';
                // console.log(newDocumentary);
                this.props.onSendDocument(newDocumentary);
              }}
            >
              Chuy???n ti???p
            </Button>
            <Button onClick={this.handleClose} variant='outlined' color="primary">
              H???y
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

DialogSend.propTypes = {};

export default DialogSend;
