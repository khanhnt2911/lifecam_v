/**
 *
 * AddPayManager
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TableBody, TableCell, Table, TableRow, TableHead, Button } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TrendingFlat } from '@material-ui/icons';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import Buttons from 'components/CustomButtons/Button';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import ListPage from 'components/List';
import { tableToExcel } from '../../helper';
import makeSelectAddPayManager from './selectors';
import reducer from './reducer';
import saga from './saga';
import { API_REPORT } from '../../config/urlConfig';
import LiabilitiesChart from '../LiabilitiesReport/LiabilitiesChart';
import { Grid, Paper, Typography } from '../../components/LifetekUi';
import { changeSnackbar } from '../Dashboard/actions';
import { mergeData, getData, getReportPayManager } from './actions';
import { debtSupplierColumns } from '../../variable';
import { MENU_REPORTS } from '../../contants';
am4core.useTheme(Am4themesAnimated);

function CircleChart(props) {
  const { id, data, titleTex } = props;
  let circleChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.PieChart);
    const title = chart.titles.create();
    title.text = titleTex;
    title.fontSize = 25;
    title.marginBottom = 10;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0;
    chart.radius = am4core.percent(70);
    chart.innerRadius = am4core.percent(40);
    chart.startAngle = 180;
    chart.endAngle = 360;

    // Add data
    chart.data = data;

    // Add and configure Series
    const series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = 'value';
    series.dataFields.category = 'country';

    series.slices.template.cornerRadius = 10;
    series.slices.template.innerCornerRadius = 7;
    series.slices.template.draggable = true;
    series.slices.template.inert = true;
    series.alignLabels = false;

    series.hiddenState.properties.startAngle = 90;
    series.hiddenState.properties.endAngle = 90;

    chart.legend = new am4charts.Legend();
    circleChart = chart;
  }, []);
  useEffect(
    () => () => {
      if (circleChart) {
        circleChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
}

function CircleChart1(props) {
  const { id, data, titleTex } = props;
  let circleChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.SlicedChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

    const title = chart.titles.create();
    title.text = titleTex;
    title.fontSize = 25;
    title.marginBottom = 20;
    title.fontWeight = 'bold';
    title.margintop = 20;

    // Add data
    chart.data = data;

    // Add and configure Series
    const series = chart.series.push(new am4charts.FunnelSeries());
    series.colors.step = 2;
    series.dataFields.value = 'value';
    series.dataFields.category = 'name';
    series.alignLabels = true;
    series.orientation = 'horizontal';
    series.bottomRatio = 1;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'top';
    circleChart = chart;
  }, []);
  useEffect(
    () => () => {
      if (circleChart) {
        circleChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
}

function ColumnChart2(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, data, titleTex } = props;
  let ColumnChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.XYChart);
    const title = chart.titles.create();
    title.text = titleTex;
    title.fontSize = 25;
    title.marginBottom = 20;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = data;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = 'country';
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 11;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 200;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;

    function createSeries(field) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = 'country';
      series.dataFields.valueY = field;
      series.columns.template.tooltipText = '{valueY.value}';
      series.columns.template.tooltipY = 0;
      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    }
    createSeries('x1');
    createSeries('x2');
    createSeries('x3');
    createSeries('x4');
    createSeries('x5');

    ColumnChart = chart;
  }, []);
  useEffect(
    () => () => {
      if (ColumnChart) {
        ColumnChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
}

const GridRight = ({ children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0px', alignItems: 'flex-end' }}>{children}</div>
);
/* eslint-disable react/prefer-stateless-function */
export class AddPayManager extends React.Component {
  state = {
    circleColumns1: [
      {
        name: 'Nguy???n Qu???c Kh??nh',
        value: 215,
      },
      {
        name: 'Nguy???n Xu??n S??n ',
        value: 32.4,
      },
      {
        name: 'Ho??ng Ti???n ?????t',
        value: 4.5,
      },
      {
        name: 'D????ng Qu???c Tu???n',
        value: 10.9,
      },
      {
        name: 'Nguy???n V??n Ki??n',
        value: 4.4,
      },
      {
        name: 'Mai V??n Luy???n',
        value: 1.12,
      },
      {
        name: 'Ho??ng Minh H???i',
        value: 31.7,
      },
      {
        name: 'Nguy???n Ho??ng T??ng',
        value: 16.7,
      },
      {
        name: 'Nguy???n H???i Nam',
        value: 367,
      },
      {
        name: 'Ch??a ph??n Nh??m',
        value: 0.8,
      },
    ],

    partColumn2: [
      {
        country: 'Th??ng 1',
        x2: 4.4,
        x3: 185.6,

        x5: 4.2,
      },
      {
        country: 'Th??ng 2',
        x2: 1.3,
        x3: 62,
        x4: 11,
      },
      {
        country: 'Th??ng 3  ',
        x2: 2,
        x3: 100,
        x4: 1.9,
      },
      {
        country: 'Th??ng 4',
        x2: 2.2,
        x3: 57.5,
      },
      {
        country: 'Th??ng 5',
        x2: 3.0,
        x3: 40.1,
      },
      {
        country: 'Th??ng 6',
        x2: 2.8,
        x3: 11.2,
        x4: 1.6,
        x5: 3.1,
      },
      {
        country: 'Th??ng 7',
        x3: 4.5,
        x4: 1.6,
        x5: 8.2,
      },
      {
        country: 'Th??ng 8',
        x2: 1.3,
        x3: 13.8,
      },
      {
        country: 'Th??ng 9',

        x3: 16.9,
      },
      {
        country: 'Th??ng 10',
      },

      {
        country: 'Th??ng 11',
      },
      {
        country: 'Th??ng 12',
      },
    ],
  };

  componentDidMount() {
    this.props.getData();
    const { addPayManager } = this.props;
    const { tab } = addPayManager;
    const foundMenu = MENU_REPORTS.MENU_PAY_MANAGER.find(item => item.tab === tab);
    const { path } = foundMenu;
    this.props.getReportPayManager(path);
  }

  componentWillReceiveProps(props) {
    if (this.props.addPayManager.tab !== props.addPayManager.tab) {
      const { addPayManager: { tab } } = props;
      const foundMenu = MENU_REPORTS.MENU_PAY_MANAGER.find(item => item.tab === tab);
      const { path } = foundMenu;
      this.props.getReportPayManager(path);
    }
  }

  handleTab(tab) {
    this.props.mergeData({ tab });
  }

  mapLiabilitiReport = item => ({
    ...item,

    name: <p>{item.nameSupplier}</p>,
  });
  render() {
    const addPayManager = this.props.addPayManager;
    const { tab, filter, reports } = this.props.addPayManager;
    const Bt = props => (
      <Buttons onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'}>
        {props.children}
      </Buttons>
    );
    return (
      <div>
        <Grid container>
          <Grid item sm={12}>
            {/* <Bt tab={3} style={{ marginLeft: 30 }}>
              <i>T???ng h???p c??ng n??? ph???i tr???</i>
            </Bt>
            <Bt tab={0} style={{ marginLeft: 30 }}>
              <i>T???ng h???p c??ng n??? theo khu v???c</i>
            </Bt>
            <Bt tab={1}>
              <i>T???ng h???p c??ng n??? theo nh??n vi??n kd</i>
            </Bt>
            <Bt tab={2}>
              <i>S??? d?? c??ng n??? ph???i thu theo th???i gian</i>
            </Bt> */}
          </Grid>
        </Grid>
        {tab === 0 ? (
          <div>
            <Paper>
              <Typography style={{ marginTop: 10, fontSize: 25 }}>T???ng h???p c??ng n??? theo khu v???c</Typography>
            </Paper>
            <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
              <Grid item md={12}>
                <CircleChart data={addPayManager.circleColumns} id="chart4" style={{ width: '100%', height: '50vh', marginTop: 30 }} />
              </Grid>
            </Grid>
            <Paper>
              {' '}
              <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>N???i dung</TableCell>
                      <TableCell>Mi???n B???c </TableCell>
                      <TableCell>Mi???n Trung</TableCell>
                      <TableCell>Mi???n Nam</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>S??? d?? c??ng n???</TableCell>
                      <TableCell>285,629,736</TableCell>
                      <TableCell align="left">18,788,200 </TableCell>
                      <TableCell>380,318,922</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Paper>
          </div>
        ) : null}

        {tab === 1 ? (
          <div>
            <Paper>
              <Typography style={{ marginTop: 10, fontSize: 25 }}>T???ng h???p c??ng n??? theo nh??n vi??n kd</Typography>
            </Paper>
            <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
              <Grid item md={12}>
                <CircleChart1 data={this.state.circleColumns1} id="chart2" style={{ width: '100%', height: '50vh', marginTop: 30 }} />
              </Grid>
            </Grid>
            <Paper>
              {' '}
              <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>N???i dung</TableCell>
                      <TableCell>B???c C???n </TableCell>
                      <TableCell>B???c Giang</TableCell>
                      <TableCell>B???c Ninh</TableCell>
                      <TableCell>H???i D????ng</TableCell>
                      <TableCell>H?? Nam</TableCell>
                      <TableCell>H?? N???i </TableCell>
                      <TableCell>H???i Ph??ng</TableCell>
                      <TableCell>H??ng Y??n</TableCell>
                      <TableCell>Nam ?????nh</TableCell>
                      <TableCell>Ph?? Th???</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>S??? d?? </TableCell>
                      <TableCell>231,016,745</TableCell>
                      <TableCell align="left">811,194,163</TableCell>
                      <TableCell>816,235,627 </TableCell>
                      <TableCell align="left">1,110,021,699</TableCell>
                      <TableCell>708,359,997</TableCell>
                      <TableCell>2,336,090,635</TableCell>
                      <TableCell align="left">343,410,910</TableCell>
                      <TableCell>1,943,587,407 </TableCell>
                      <TableCell align="left">1,030,406,551</TableCell>
                      <TableCell>340,467,513</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Paper>
          </div>
        ) : null}
        {tab === 2 ? (
          <div>
            <Paper>
              <Typography style={{ marginTop: 25, fontSize: 25 }}>T???ng h???p thu ti??u trong n??m</Typography>
            </Paper>
            <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
              <Grid item md={12}>
                <ColumnChart2 style={{ width: '100%', height: '50vh' }} data={this.state.partColumn2} id="chart3" />
              </Grid>
            </Grid>
            <Paper>
              {' '}
              <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>N???i dung</TableCell>
                      <TableCell>Th??ng 1</TableCell>
                      <TableCell>Th??ng 2</TableCell>
                      <TableCell>Th??ng 3</TableCell>
                      <TableCell>Th??ng 4</TableCell>
                      <TableCell>Th??ng 5</TableCell>
                      <TableCell>Th??ng 6</TableCell>
                      <TableCell>Th??ng 7</TableCell>
                      <TableCell>Th??ng 8</TableCell>
                      <TableCell>Th??ng 9</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>C??ng ty CP SX - TM H???ng Nga - CN Bi??n H??a</TableCell>
                      <TableCell>4,425,200</TableCell>
                      <TableCell>1,313,200 </TableCell>
                      <TableCell>2,090,800 </TableCell>
                      <TableCell>2,249,400</TableCell>
                      <TableCell>3,032,800</TableCell>
                      <TableCell>2,787,800</TableCell>
                      <TableCell>623,600</TableCell>
                      <TableCell>1,339,400 </TableCell>
                      <TableCell>132,000 </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>C??ng ty CP th????ng m???i An Khang</TableCell>
                      <TableCell>185,610,008</TableCell>
                      <TableCell>62,025,812 </TableCell>
                      <TableCell>100,479,058 </TableCell>
                      <TableCell>57,583,470</TableCell>
                      <TableCell>40,117,256</TableCell>
                      <TableCell>11,212,142 </TableCell>
                      <TableCell>4,482,560 </TableCell>
                      <TableCell>13,814,570</TableCell>
                      <TableCell>16,900,840</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cty TNHH TM Thanh Anh</TableCell>
                      <TableCell>91,800 </TableCell>
                      <TableCell>10,931,800 </TableCell>
                      <TableCell>1,923,200</TableCell>
                      <TableCell>- </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>1,650,200</TableCell>
                      <TableCell>- </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>- </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cty TNHH TM DV Minh T??m</TableCell>
                      <TableCell>4,230,600</TableCell>
                      <TableCell>534,000 </TableCell>
                      <TableCell>1,011,000</TableCell>
                      <TableCell>379,000 </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>3,132,600 </TableCell>
                      <TableCell>8,127,800 </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Paper>
          </div>
        ) : null}
        {tab === 3 ? (
          <div>
            {' '}
            <div>
              <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
                <Grid item md={12}>
                  <LiabilitiesChart
                    titles="B??O C??O T???NG H???P C??NG N??? PH???I TR???"
                    data={addPayManager.circleColumns}
                    id="chart5"
                    style={{ width: '100%', height: '50vh', marginTop: 30 }}
                  />
                </Grid>
                <Grid item md={2} style={{ marginLeft: 30, marginTop: 30 }}>
                  <GridRight>
                    <Typography color="primary">T???ng c??ng n???: </Typography>
                    <p>{reports.total}</p>
                  </GridRight>
                </Grid>
              </Grid>

              <MuiPickersUtilsProvider utils={MomentUtils}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 20 }}>
                  <DateTimePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY HH:mm"
                    label="T??? Ng??y"
                    value={addPayManager.startDate}
                    name="startDate1"
                    error={false}
                    helperText={null}
                    variant="outlined"
                    margin="dense"
                    onChange={value => this.props.mergeData({ startDate: value })}
                    style={{ padding: 10 }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingFlat color="primary" />
                  </div>

                  <DateTimePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY HH:mm"
                    label="?????n"
                    error={false}
                    helperText={null}
                    value={addPayManager.endDate}
                    name="endDate"
                    margin="dense"
                    variant="outlined"
                    onChange={value => this.handleChangeDate(value)}
                    style={{ padding: 10 }}
                  />
                </div>
              </MuiPickersUtilsProvider>
              <div id="report-task1">
                <ListPage
                  // kanban="ST11"
                  disableEdit
                  disableAdd
                  disableConfig
                  columns={debtSupplierColumns}
                  apiUrl={`${API_REPORT}/debtSupplier`}
                  filter={filter}
                  // client
                  mapFunction={this.mapLiabilitiReport}
                />
              </div>
              <Button
                variant="outlined"
                color="primary"
                style={{ cursor: 'pointer', marginRight: 70, float: 'right', marginBottom: 40 }}
                type="button"
                onClick={() => tableToExcel('report-task1', 'W3C Example Table')}
              >
                Xu???t File Excel
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  handleChangeDate = value => {
    if (new Date(this.props.addPayManager.startDate) > new Date(value)) {
      this.props.onChangeSnackbar({ status: true, message: 'Th???i gian k???t th??c ph???i l???n h??n th???i gian b???t ?????u', variant: 'warning' });
      return;
    }
    this.props.mergeData({
      endDate: value,
      filter: {
        startDate: new Date(this.props.addPayManager.startDate).toISOString(),
        endDate: new Date(value).toISOString(),
      },
    });
  };
}

AddPayManager.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addPayManager: makeSelectAddPayManager(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData, getData(data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    getData: () => dispatch(getData()),
    getReportPayManager: (path) => dispatch(getReportPayManager(path))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addPayManager', reducer });
const withSaga = injectSaga({ key: 'addPayManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddPayManager);
