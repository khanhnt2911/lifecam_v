/* eslint-disable consistent-return */
/**
 *
 * ProductInforDrawer
 *
 */

import React from 'react';
import { Table, Paper, TableCell, TableRow, TableBody, withStyles, Toolbar, AppBar, Typography, IconButton, TableHead } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import classnames from 'classnames';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import styles from './styles';
/* eslint-disable react/prefer-stateless-function */
class ProductInforDrawer extends React.Component {
  render() {
    const { classes, product = {}} = this.props;
    let agencyListDisplay = [];
    let text = '';
    let amountBackup = 0;
    if (product.sellingPoint) {
      if (!product.isService && product.otherInfo) {
        agencyListDisplay = product.sellingPoint.filter(item => item.amount > 0).map(n => n.name);
        let amount = 0;
        if (this.props.currentStock === 0) {
          product.sellingPoint.forEach(item => {
            amount += item.amount;
          });
        } else {
          // eslint-disable-next-line array-callback-return
          const x = product.sellingPoint.find(n => {
            if (this.props.currentStock === n.organizationUnitId) return true;
          });
          if (x) {
            amount = x.amount;
          }
        }
        amountBackup = amount;
        let listUnit = product.otherInfo.unitChange;
        if (listUnit.length > 0) {
          // let unitArr = [];
          const numberExchange = [];
          if (product.unit && product.unit.unitId === listUnit[0].from.unitId) {
            listUnit = listUnit.reverse();
          }
          listUnit.forEach(item => {
            numberExchange.push(item.numberExchange);
          });
          let number = [];
          if (numberExchange.length > 1) {
            for (let i = 0; i < numberExchange.length; i++) {
              let x = numberExchange[i];
              for (let j = i + 1; j < numberExchange.length; j++) {
                x *= numberExchange[j];
              }
              number.push(x);
            }
          } else number = numberExchange;
          listUnit.forEach((item, index) => {
            const unit = parseInt(amount / number[index], 10);
            amount %= number[index];
            if (text !== '') {
              text += `, ${unit} ${item.to.unit}`;
            } else text += `${unit} ${item.to.unit}`;
            if (index === listUnit.length - 1 && amount !== 0) {
              if (text !== '') {
                text += `, ${amount} ${item.from.unit}`;
              } else text += `${amount} ${item.from.unit}`;
            }
          });
        } else text = `${amount} ${product.unit ? product.unit.name : ''}`;
      } else text = 'l?? d???ch v???';
    }

    return (
      <div style={{ marginTop: 100 }}>
        <AppBar>
          <Toolbar>
            <IconButton color="inherit" onClick={this.props.onClose} aria-label="Close">
              <Close />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              Chi ti???t s???n ph???m
            </Typography>
            {/* <Button color="inherit" onClick={this.handleClose}>
              save
            </Button> */}
          </Toolbar>
        </AppBar>
        <div>
          <Paper
            className={classnames(classes.paper, classes.productBlock)}
            // style={{ display: 'flex', justifyContent: 'space-around', cursor: 'pointer' }}
          >
            <div style={{ width: '20%' }}>{product.logo ? <img height={150} alt="" src={product.logo} /> : ''}</div>
            <div style={{ width: '70%', marginTop: 20 }}>
              <Typography color="primary" style={{ fontWeight: 'bold' }}>
                {product.name || ''}
              </Typography>
              <Typography component="p">{product.catalog ? product.catalog.name : ''}</Typography>
            </div>
          </Paper>

          <Paper className={classes.paper}>
            <Table className={classes.table}>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Chu???n m?? v???ch
                  </TableCell>
                  <TableCell align="right">{product.barcode || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    M?? s???n ph???m
                  </TableCell>
                  <TableCell align="right">{product.code || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    T??n h??ng h??a, d???ch v???
                  </TableCell>
                  <TableCell align="right">{product.name || ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    K??ch th?????c
                  </TableCell>
                  <TableCell align="right">{product.size ? product.size : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Nh?? cung c???p
                  </TableCell>
                  <TableCell align="right">{product.supplier ? product.supplier.name : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Gi?? v???n
                  </TableCell>
                  <TableCell align="right">{product.pricePolicy ? product.pricePolicy.sourcePrice : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Gi?? b??n
                  </TableCell>
                  <TableCell align="right">{product.pricePolicy ? product.pricePolicy.costPrice : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Gi?? khuy???n m???i
                  </TableCell>
                  <TableCell align="right">{product.otherInfo ? product.otherInfo.salePrice : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    S??? l?????ng
                  </TableCell>
                  <TableCell align="right">{product.isService ? `${text}` : `${amountBackup}(${text})`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    H???n m???c ?????t h??ng
                  </TableCell>
                  <TableCell align="right">{product.otherInfo ? product.otherInfo.limitOrder : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    ??i???m b??n h??ng
                  </TableCell>
                  <TableCell align="right">{agencyListDisplay.join(', ')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    M?? t???
                  </TableCell>
                  <TableCell align="right">{product.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Cho ph??p m?? t???
                  </TableCell>
                  <TableCell align="right">{product.isDescription ? 'C??' : 'T??? ch???i'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    M???t h??ng c?? s??? serial
                  </TableCell>
                  <TableCell align="right">{product.isSerial ? 'C??' : 'T??? ch???i'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
          <Paper className={classes.paper}>
            <h4 className={classes.titleTable}>B??? thu???c t??nh</h4>
            {product.attributeSet && Array.isArray(product.attributeSet.content ) && product.attributeSet.content.map(item => (
              <Paper style={{ margin: 10 }}>
                <h5 style={{ margin: 10 }}> {item.name}</h5>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell component="th">T??n</TableCell>
                      <TableCell component="th" align="right">
                        Gi?? tr???
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody />
                  <TableBody>
                    {item.propertiesList.map(ele => (
                      <TableRow>
                        <TableCell>{ele.name}</TableCell>
                        <TableCell>{ele.options.map(item => item.name).join(',')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            ))}
          </Paper>
          <Paper className={classes.paper}>
            <h4 className={classes.titleTable}>Danh s??ch c??c ????n b??n h??ng t???m d???ng</h4>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell component="th">M?? s???n ph???m</TableCell>
                  <TableCell component="th" align="right">
                    S??? l?????ng
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody />
            </Table>
          </Paper>
          <Paper className={classes.paper} style={{ marginBottom: 20 }}>
            <h4 className={classes.titleTable}>Danh s??ch c??c ????n nh???p t???m d???ng </h4>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell component="th">M?? s???n ph???m</TableCell>
                  <TableCell align="right">S??? l?????ng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody />
            </Table>
          </Paper>
        </div>
      </div>
    );
  }
}

ProductInforDrawer.propTypes = {
  classes: PropTypes.object,
  onClose: PropTypes.func,
};

export default withStyles(styles)(ProductInforDrawer);
