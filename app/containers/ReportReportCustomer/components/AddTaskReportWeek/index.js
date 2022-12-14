import {
  Grid,
  Paper,
  Typography,
  TableBody,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  TextField,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import ListPage from 'components/List';
import { API_REPORT_TASK_WEEK, API_PERSONNEL } from 'config/urlConfig';
import { MODULE_CODE } from 'utils/constants';
import _ from 'lodash';
import moment from 'moment';
import ExportTable from './exportTable';
import { tableToExcel, tableToPDF } from 'helper';
import CustomInputField from 'components/Input/CustomInputField';
import { serialize } from 'utils/common';
import { makeSelectProfile, makeSelectMiniActive } from '../../../Dashboard/selectors';
import { Archive } from '@material-ui/icons';
function AskTaskReportWeek(props) {
  const { item, miniActive } = props;
  const [data, setData] = useState({});
  const [exportAnchor, setExportAnchor] = useState(null);
  const [exportDate, setExportDate] = useState('');
  const [html, setHtml] = useState([]);
  const [htmlTotal, setHtmlTotal] = useState(0);
  const [openExcel, setOpenExcel] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(
    () => {
      const query = {
        filter: {},
      };
      if (category) {
        query.filter.category = category.code;
      }
      fetch(`${API_REPORT_TASK_WEEK}?${serialize(query)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then(result => result.json())
        .then(data => {
          let result = data.data;
          result = _.groupBy(result, 'kanbanStatus');
          try {
            JSON.parse(localStorage.getItem('taskStatus')) &&
              JSON.parse(localStorage.getItem('taskStatus'))
                .find(i => i.code === 'KANBAN')
                .data.forEach(st => {
                  if (!result[st.name]) {
                    result[st.name] = [];
                  }
                });
          } catch (e) {
            console.log('e', e);
          }
          setData(result);
        });
    },
    [category],
  );

  const onExportExcel = () => {
    // if (!exportDate || moment(exportDate).isBefore(moment(filter.startDate))) {
    //   props.onChangeSnackbar({ status: true, message: 'Ng??y xu???t b??o c??o kh??ng h???p l???!', variant: 'error' });
    //   return;
    // }

    setOpenExcel('Excel');
  };
  const onExportPDF = () => {
    // if (!exportDate || moment(exportDate).isBefore(moment(filter.startDate))) {
    //   props.onChangeSnackbar({ status: true, message: 'Ng??y xu???t b??o c??o kh??ng h???p l???!', variant: 'error' });
    //   return;
    // }

    setOpenExcel('PDF');
  };
  useEffect(
    () => {
      if (html.length > 0 && htmlTotal !== 0) {
        if (html.length === htmlTotal) {
          for (let index = 0; index < htmlTotal; index++) {
            const win = window.open();
            win.document.write(html[index].content);
            win.document.close();
            win.print();
          }

          setHtml([]);
          setHtmlTotal(0);
        }
      }
    },
    [html, htmlTotal],
  );

  const handleCloseExcel = payload => {
    const type = openExcel;
    setOpenExcel(null);

    if (payload && payload.error) {
      if (payload.res && payload.res.message) {
        const { message } = payload.res;
        console.log(message, 'ooooooooo');
      } else {
        console.log('loisssssss');
      }
      return;
    }

    switch (type) {
      case 'PDF':
        const { totalPage = 1, pageNumber = 1 } = payload || {};
        const content = tableToPDF('reportTaskWeek');
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      default:
        tableToExcel('reportTaskWeek', 'W3C Example Table');
    }

    // setOpenExcel(null);
    // tableToExcel('excel-table-customer-contract', 'W3C Example Table');
  };
  const numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <Grid style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 80px)' }}>
      <Paper style={{ marginTop: 20 }}>
        <Typography gutterBottom variant="h5" style={{ marginTop: 30, marginLeft: 600 }}>
          B??o c??o c??ng t??c tu???n
        </Typography>
        <div style={{ width: 250, marginLeft: 20, marginTop: 20 }}>
          <CustomInputField
            configType="taskStatus"
            configCode="TASKTYPE"
            type="Source|TaskConfig,TASKTYPE|Id||code"
            name="category"
            label="Lo???i CV/DA"
            isChecked
            value={category}
            onChange={e => {
              setCategory(e.target.value);
            }}
          />
          <Tooltip title="Xu???t d??? li???u">
            <IconButton aria-label="Export" onClick={e => setExportAnchor(e.currentTarget)}>
              <Archive style={{ width: '30px', height: '30px' }} />
            </IconButton>
          </Tooltip>
        </div>
        <Table>
          <TableHead>
            <TableCell style={styles.title}>STT</TableCell>
            <TableCell style={styles.title}>M?? CVDA</TableCell>
            <TableCell style={styles.title}>T??n d??? ??n</TableCell>
            <TableCell style={styles.title}>Kh??ch h??ng</TableCell>
            <TableCell style={styles.title}>Gi?? tr??? H??</TableCell>
            <TableCell style={styles.title}>Ti???n ????? th???c hi???n</TableCell>
            <TableCell style={styles.title}>C??n b??? theo d??i</TableCell>
            <TableCell style={styles.title}>Trong tu???n</TableCell>
            <TableCell style={styles.title}>Tu???n t???i</TableCell>
            <TableCell style={styles.title}>Ki???n ngh???</TableCell>
          </TableHead>
          <TableBody>
            {Object.keys(data).map(key => {
              return (
                <Fragment key={key}>
                  <TableRow>
                    <TableCell colSpan={9}>
                      <span style={{ fontWeight: 'bold' }}>Tr???ng th??i:</span> {key}
                    </TableCell>
                  </TableRow>

                  {data[key].map((item, index) => {
                    return (
                      <TableRow key={item._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.customer}</TableCell>
                        <TableCell>{numberWithCommas(parseInt(item.totalContractValue))}</TableCell>
                        <TableCell>{item.duration}</TableCell>
                        <TableCell>{item.inCharge}</TableCell>
                        <TableCell>
                          {Array.isArray(item.weekTasks)
                            ? item.weekTasks.map(t => (
                                <div>
                                  <div>
                                    <b>{t.name}</b>
                                  </div>
                                  {Array.isArray(t.comments)
                                    ? t.comments.map(c => (
                                        <div style={{ paddingLeft: 10 }}>
                                          {`${c.user ? c.user.name : ''} - ${
                                            c.user && c.user.organizationUnit ? c.user.organizationUnit.name : ''
                                          } : ${c.content}`}
                                        </div>
                                      ))
                                    : null}
                                </div>
                              ))
                            : null}
                        </TableCell>
                        <TableCell>
                          {Array.isArray(item.nextWeekTasks)
                            ? item.nextWeekTasks.map(t => (
                                <div>
                                  <div>
                                    <b>{t.name}</b>
                                  </div>
                                  {Array.isArray(t.comments)
                                    ? t.comments.map(c => (
                                        <div style={{ paddingLeft: 10 }}>
                                          {`${c.user ? c.user.name : ''} - ${
                                            c.user && c.user.organizationUnit ? c.user.organizationUnit.name : ''
                                          } : ${c.content}`}
                                        </div>
                                      ))
                                    : null}
                                </div>
                              ))
                            : null}
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    );
                  })}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
      <ExportTable
        exportType={openExcel}
        // filter={newFilter}
        url={`${API_REPORT_TASK_WEEK}`}
        open={openExcel}
        onClose={handleCloseExcel}
        // exportDate={exportDate}
        startDate={moment().format('YYYY-MM-DD')}
        endDate={moment().format('YYYY-MM-DD')}
        // employee={employee}
        // department={filter.organizationUnitId}
        // customer={customer}
        // maxLimit={maxLimit}
      />

      <Grid item xs={12} container direction="row" alignItems="center" spacing={16} style={{ paddingTop: 20 }}>
        <Grid item xs={4} container direction="row" alignItems="flex-end" style={{ paddingLeft: 50 }}>
          {/* <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker
                inputVariant="outlined"
                format="DD/MM/YYYY"
                value={exportDate}
                variant="outlined"
                label="Ng??y xu???t b??o c??o"
                margin="dense"
                required
                name="exportDate"
                disableFuture
              />
            </MuiPickersUtilsProvider> */}
        </Grid>

        <Grid item xs={8} container direction="row" justify="flex-end" style={{ paddingRight: 50 }}>
          {/* <Button variant="outlined" color="primary" onClick={e => setExportAnchor(e.currentTarget)} style={styles.importBtn}>
            Xu???t b??o c??o
          </Button> */}
          {/* <Button variant="outlined" color="secondary" onClick={props.onClose} style={styles.importBtn}>
              Tho??t
            </Button> */}
          <Menu keepMounted open={Boolean(exportAnchor)} onClose={() => setExportAnchor(null)} anchorEl={exportAnchor}>
            <MenuItem onClick={onExportExcel} style={styles.menuItem}>
              Excel
            </MenuItem>
            <MenuItem onClick={onExportPDF} style={styles.menuItem}>
              PDF
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </Grid>
  );
}

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(AskTaskReportWeek);

const styles = {
  title: {
    textTranform: 'uppercase',
  },
  importBtn: {
    marginLeft: 10,
    // marginRight: 20,
    width: 200,
  },
  menuItem: {
    width: 200,
    justifyContent: 'center',
  },
};
