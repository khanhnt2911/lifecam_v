/* eslint-disable no-self-compare */
/* eslint-disable no-bitwise */
/**
 *
 * BusinessOpportunitiesReport
 *
 */

import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid, Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@material-ui/core';
import { DateRangePicker } from 'react-date-range';
import moment from 'moment';
import _ from 'lodash';
import Progressbar from 'react-progressbar';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import dot from 'dot-object';
import HOCTable from '../HocTable';
import makeSelectBusinessOpportunitiesReport from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getItemByRangeAct, getLogsByRangeAct } from './actions';
import CustomDatePicker from '../../components/CustomDatePicker';
// import messages from './messages';

am4core.useTheme(Am4themesAnimated);

function CircleChart(props) {
  const { id, data, titleTex } = props;
  let circleChart;
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.PieChart);
      chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
      chart.paddingLeft = 150;
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.data = data;
      chart.validateData();
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'value';
      pieSeries.dataFields.category = 'name';
      pieSeries.alignLabels = true;
      // this makes only A label to be visible
      pieSeries.labels.template.propertyFields.disabled = 'disabled';
      pieSeries.ticks.template.propertyFields.disabled = 'disabled';

      pieSeries.ticks.template.locationX = 1;
      pieSeries.ticks.template.locationY = 0;

      pieSeries.labelsContainer.width = 100;

      chart.legend = new am4charts.Legend();

      chart.legend.paddingRight = 160;
      chart.legend.paddingBottom = 40;
      const marker = chart.legend.markers.template.children.getIndex(0);
      chart.legend.markers.template.width = 20;
      chart.legend.markers.template.height = 10;
      marker.cornerRadius(10, 10, 20, 20);
      circleChart = chart;
    },
    [data],
  );
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

function FunnelChart(props) {
  const { id, data, titleTex } = props;
  let funnelChart;
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.SlicedChart);
      chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
      // chart.paddingLeft = 150;
      chart.paddingRight = 120;
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.data = data;
      chart.validateData();
      const pieSeries = chart.series.push(new am4charts.FunnelSeries());
      pieSeries.dataFields.value = 'value';
      pieSeries.dataFields.category = 'name';
      pieSeries.alignLabels = true;
      // this makes only A label to be visible
      pieSeries.labels.template.propertyFields.disabled = 'disabled';
      pieSeries.ticks.template.propertyFields.disabled = 'disabled';

      pieSeries.ticks.template.locationX = 1;
      pieSeries.ticks.template.locationY = 0;

      pieSeries.labelsContainer.width = 100;

      chart.legend = new am4charts.Legend();

      // chart.legend.paddingRight = 160;
      chart.legend.paddingBottom = 40;
      const marker = chart.legend.markers.template.children.getIndex(0);
      chart.legend.markers.template.width = 20;
      chart.legend.markers.template.height = 10;
      marker.cornerRadius(10, 10, 20, 20);
      funnelChart = chart;
    },
    [data],
  );
  useEffect(
    () => () => {
      if (funnelChart) {
        funnelChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
}

function ColumnChart(props) {
  const { id, data, titleTex } = props;
  let funnelChart;
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.XYChart);
      chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
      // chart.paddingLeft = 150;
      chart.paddingBottom = 100;
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.data = data;
      chart.validateData();
      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'name';
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 30;

      categoryAxis.renderer.labels.template.adapter.add('dy', (dy, target) => {
        if (target.dataItem && target.dataItem.index & (2 === 2)) {
          return dy + 25;
        }
        return dy;
      });

      // eslint-disable-next-line no-unused-vars
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

      // Create series
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = 'value';
      series.dataFields.categoryX = 'name';
      series.name = 'Amount';
      series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';
      series.columns.template.fillOpacity = 0.8;

      const columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;
      funnelChart = chart;
    },
    [data],
  );
  useEffect(
    () => () => {
      if (funnelChart) {
        funnelChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
}

const actionDefineList = [
  {
    name: 'B??nh lu???n',
    type: 'messages',
  },
  {
    name: 'T???o c??ng vi???c',
    type: 'task',
  },
  {
    name: 'G???i ??i???n',
    type: 'call',
  },
  {
    name: 'Th??m doanh nghi???p',
    type: 'Visit',
  },
  {
    name: 'L???ch h???p',
    type: 'Meeting',
  },
  {
    name: 'Nh???c l???ch',
    type: 'Reminder',
  },
];

const CustomKanbanStatus = props => {
  const propsFromTable = props.kanbanProps.slice();
  const laneStart = [];
  const laneAdd = [];
  const laneSucces = [];
  const laneFail = [];

  propsFromTable.forEach(item => {
    switch (item.code) {
      case 1:
        laneStart.push(item);
        break;
      case 2:
        laneAdd.push(item);
        break;

      case 3:
        laneSucces.push(item);
        break;

      case 4:
        laneFail.push(item);
        break;

      default:
        break;
    }
  });
  const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
  const itemFromTable = Object.assign({}, props.item);
  const kanbanStatusNumber = sortedKanbanStatus.findIndex(n => String(n._id) === String(itemFromTable.kanbanStatus));
  const kanbanValue = ((kanbanStatusNumber + 1) / propsFromTable.length) * 100;
  return (
    <div>
      {sortedKanbanStatus[kanbanStatusNumber] !== undefined ? (
        <Progressbar color={sortedKanbanStatus[kanbanStatusNumber].color} completed={kanbanValue} />
      ) : (
        <span>Kh??ng x??c ?????nh</span>
      )}
    </div>
  );
};
/* eslint-disable react/prefer-stateless-function */
export class BusinessOpportunitiesReport extends React.Component {
  state = {
    openPickDate: false,
    openData: false,
    dateString: `T??? ${moment()
      .subtract(1, 'months')
      .format('DD/MM/YYYY')} ?????n ${moment().format('DD/MM/YYYY')}`,
    selectionRange: {
      startDate: new Date(moment().subtract(1, 'months')),
      endDate: new Date(),
      key: 'selection',
    },
    dialogSelectionRange: {
      // startDate: new Date(moment().subtract(1, 'months')),
      // endDate: new Date(),
      endDate: moment().format('YYYY-MM-DD'),
      startDate: moment()
        .clone()
        .startOf('month')
        .format('YYYY-MM-DD'),
      key: 'selection',
    },
    crmStatusSteps: [],
    funnelData: [],
    columnData: [],
    actionsData: [],
    sourceData: [],
    numberOfBos: 0,
    numberOfExchange: 0,
    numberOfDispose: 0,
    numberOfSuccess: 0,
    arrayFailed: [],
    itemsList: [],
    arrayConvert: [],
    arrayData: [],
    errorStartDateEndDate: false,
    errorTextStartDate: '',
    errorTextEndDate: '',
  };

  componentDidMount() {
    const listCrmStatus = JSON.parse(localStorage.getItem('crmStatus'));
    const currentCrmStatus = listCrmStatus[listCrmStatus.findIndex(d => d.code === 'ST01')];
    const laneStart = [];
    const laneAdd = [];
    const laneSucces = [];
    const laneFail = [];
    currentCrmStatus &&
      currentCrmStatus.data.forEach(item => {
        switch (item.code) {
          case 1:
            laneStart.push(item);
            break;
          case 2:
            laneAdd.push(item);
            break;

          case 3:
            laneSucces.push(item);
            break;

          case 4:
            laneFail.push(item);
            break;

          default:
            break;
        }
      });
    const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
    const listCrmSource = JSON.parse(localStorage.getItem('crmSource'));
    const currentSource = listCrmSource[listCrmSource.findIndex(d => d.code === 'S06')];
    this.setState({ crmStatusSteps: sortedKanbanStatus, sourceData: currentSource.data });
    const { selectionRange } = this.state;
    const start = `${moment(selectionRange.startDate).format('YYYY-MM-DD')}T00:00:00.000Z`;
    const end = `${moment(selectionRange.endDate).format('YYYY-MM-DD')}T23:59:00.000Z`;
    const params = {
      filter: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    };
    const params2 = {
      filter: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
        model: 'BusinessOpportunities',
      },
    };
    this.props.onGetItem(params);
    this.props.onGetLogs(params2);
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { businessOpportunitiesReport } = props;
      const { crmStatusSteps, sourceData } = this.state;
      const itemsList = businessOpportunitiesReport.items || [];
      const actionsList = businessOpportunitiesReport.logs || [];
      const newList = _.groupBy(itemsList, 'kanbanStatus');
      const dataList = crmStatusSteps.map(item => ({
        name: item.name,
        value: newList[item._id] ? newList[item._id].length : 0,
      }));

      const newActionsList = _.groupBy(actionsList, 'type');
      const dataActionsList = actionDefineList.map(item => ({
        name: item.name,
        value: newActionsList[item.type] ? newActionsList[item.type].length : 0,
      }));

      const dataSourceList = sourceData.map(x => {
        let count = 0;
        itemsList.forEach(a => {
          if (a.source && a.source.includes(x.title)) {
            count++;
          }
        });
        return {
          name: x.title,
          value: count,
        };
      });

      let arraySuccess = [];
      let arrayFailed = [];

      crmStatusSteps.forEach(z => {
        if (Number(z.code) === 3) {
          arraySuccess = arraySuccess.concat(newList[z._id]);
        }
        if (Number(z.code) === 4) {
          arrayFailed = arrayFailed.concat(newList[z._id]);
        }
      });

      const arrayConvert = itemsList.filter(n => n.exchangingAgreement);
      this.setState({
        funnelData: dataList,
        columnData: dataSourceList,
        actionsData: dataActionsList,
        numberOfBos: itemsList.length || 0,
        numberOfDispose: arrayFailed.length || 0,
        arrayFailed,
        numberOfSuccess: arraySuccess.length || 0,
        itemsList,
        numberOfExchange: arrayConvert.length || 0,
        arrayConvert,
      });
    }
  }

  render() {
    const { arrayData, dialogSelectionRange, errorStartDateEndDate, errorTextStartDate, errorTextEndDate } = this.state;
    const { startDate, endDate } = dialogSelectionRange;
    const newDataList = arrayData.map(item => dot.dot(item));
    return (
      <div>
        {/* <FormattedMessage {...messages.header} /> */}
        <Grid container spacing={8} style={{ margin: '0 20px' }}>
          {/* <Button
              onClick={() => {
                const { selectionRange } = this.state;
                this.setState({ openPickDate: true, dialogSelectionRange: selectionRange });
              }}
            >
              {this.state.dateString}
            </Button> */}
          <Grid item md={3}>
            <CustomDatePicker name="startDate" label="T??? ng??y" value={startDate} onChange={e => this.handleChangeFiler(e, true)} />
            {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextStartDate}</Typography> : null}
          </Grid>
          <Grid item md={3}>
            <CustomDatePicker name="endDate" label="?????n ng??y" value={endDate} onChange={e => this.handleChangeFiler(e, false)} />
            {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextEndDate}</Typography> : null}
          </Grid>
        </Grid>
        <FunnelChart
          data={this.state.funnelData}
          titleTex="Tr???ng th??i Kanban"
          id="chart1"
          style={{ width: '48%', height: '500px', margin: 0, display: 'inline-flex' }}
        />
        <ColumnChart
          data={this.state.columnData}
          titleTex="Ngu???n kh??ch h??ng"
          id="chart2"
          style={{ width: '48%', height: '500px', margin: 0, display: 'inline-flex' }}
        />
        <CircleChart
          data={this.state.actionsData}
          titleTex="H??nh ?????ng"
          id="chart3"
          style={{ width: '48%', height: '500px', margin: 0, display: 'inline-flex' }}
        />
        <Grid md={12} container item style={{ width: '90%', margin: '0 auto' }} spacing={24}>
          <Grid item md={6} onClick={() => this.handleOpenData(1)} style={{ cursor: 'pointer' }}>
            <Typography style={{ background: '#31B404', height: '30px', color: '#fff', paddingLeft: '10px', lineHeight: '30px' }}>
              S??? C?? H???I KINH DOANH
            </Typography>
            <Typography
              component="div"
              style={{
                background: '#64F26B',
                height: '90px',
                color: '#fff',
                textAlign: 'right',
                paddingRight: '20px',
                fontSize: '80px',
                lineHeight: '90px',
              }}
            >
              {this.state.numberOfBos}
            </Typography>
            <Typography style={{ background: '#31B404', height: '30px', color: '#fff', paddingLeft: '10px', lineHeight: '30px' }}>
              Xem chi ti???t
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Typography style={{ background: '#01C3E2', height: '30px', color: '#fff', paddingLeft: '10px', lineHeight: '30px', flex: 'auto' }}>
              T??? L??? TH??NH C??NG
            </Typography>
            <Typography
              component="div"
              style={{
                background: '#71E0F3',
                height: '90px',
                color: '#fff',
                textAlign: 'right',
                paddingRight: '20px',
                fontSize: '80px',
                lineHeight: '90px',
              }}
            >
              {Math.round((this.state.numberOfSuccess / this.state.numberOfBos) * 100) / 100}%
            </Typography>
            <Typography style={{ background: '#01C3E2', height: '30px', color: '#fff', paddingLeft: '10px', lineHeight: '30px', flex: 'auto' }} />
          </Grid>
          <Grid item md={6} container>
            <Grid item md={6} onClick={() => this.handleOpenData(2)} style={{ cursor: 'pointer' }}>
              <Typography style={{ background: '#01C3E2', height: '30px', color: '#fff', paddingLeft: '10px', lineHeight: '30px' }}>
                S??? C?? H???I CHUY???N ?????I TRAO ?????I TH???A THU???N
              </Typography>
              <Typography
                component="div"
                style={{
                  background: '#71E0F3',
                  height: '90px',
                  color: '#fff',
                  textAlign: 'right',
                  paddingRight: '20px',
                  fontSize: '80px',
                  lineHeight: '90px',
                }}
              >
                {this.state.numberOfExchange}
              </Typography>
              <Typography style={{ background: '#01C3E2', height: '30px', color: '#fff', paddingLeft: '10px', lineHeight: '30px' }}>
                Xem chi ti???t
              </Typography>
            </Grid>
            <Grid item md={6} onClick={() => this.handleOpenData(3)} style={{ cursor: 'pointer' }}>
              <Typography style={{ background: '#E1C603', height: '30px', color: '#fff', paddingLeft: '10px', lineHeight: '30px' }}>
                S??? C?? H???I M???T
              </Typography>
              <Typography
                component="div"
                style={{
                  background: '#F8DF29',
                  height: '90px',
                  color: '#fff',
                  textAlign: 'right',
                  paddingRight: '20px',
                  fontSize: '80px',
                  lineHeight: '90px',
                }}
              >
                {this.state.numberOfDispose}
              </Typography>
              <Typography style={{ background: '#E1C603', height: '30px', color: '#fff', paddingLeft: '10px', lineHeight: '30px' }}>
                Xem chi ti???t
              </Typography>
            </Grid>
          </Grid>
          <Grid item md={6}>
            <Typography style={{ background: '#FE0306', height: '30px', color: '#fff', paddingLeft: '10px', lineHeight: '30px' }}>
              T??? L??? TH???T B???I
            </Typography>
            <Typography
              component="div"
              style={{
                background: '#FB7476',
                height: '90px',
                color: '#fff',
                textAlign: 'right',
                paddingRight: '20px',
                fontSize: '80px',
                lineHeight: '90px',
              }}
            >
              {Math.round((this.state.numberOfDispose / this.state.numberOfBos) * 100) / 100}%
            </Typography>
            <Typography style={{ background: '#FE0306', height: '30px', color: '#fff', paddingLeft: '10px', lineHeight: '30px' }} />
          </Grid>
        </Grid>
        {/* <Dialog open={this.state.openPickDate} onClose={this.handleClose} aria-labelledby="form-dialog-title" maxWidth="md">
          <DialogTitle id="form-dialog-title">Ch???n kho???ng ng??y</DialogTitle>
          <DialogContent>
            <DateRangePicker
              ranges={[this.state.dialogSelectionRange]}
              maxDate={new Date()}
              showSelectionPreview={false}
              onChange={this.handleSelect}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary" variant='outlined'>
              H???y
            </Button>
            <Button onClick={this.handleSaveDate} variant='outlined' color="primary">
              L??u
            </Button>
          </DialogActions>
        </Dialog> */}
        <Dialog open={this.state.openData} onClose={this.handleCloseData} aria-labelledby="form-dialog-title" maxWidth="md">
          <DialogTitle id="form-dialog-title">D??? li???u</DialogTitle>
          <DialogContent>
            <HOCTable
              onRef={ref => (this.HOCTable = ref)}
              customColumns={[
                {
                  columnName: 'kanbanStatus',
                  CustomComponent: CustomKanbanStatus,
                },
              ]}
              path="/crm/BusinessOpportunities"
              collectionCode="BusinessOpportunities"
              data={newDataList}
              kanbanStatuses={this.state.crmStatusSteps}
              disableAdd
              disableImport
              disableConfig
              disableSearch
              enableDelete={false}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseData} color="primary">
              ????ng
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleClose = () => {
    const { selectionRange } = this.state;
    this.setState({ openPickDate: false, dialogSelectionRange: selectionRange });
  };

  handleOpenData = num => {
    const { arrayConvert, arrayFailed, itemsList } = this.state;
    if (Number(num) === 1) {
      this.setState({ openData: true, arrayData: itemsList });
    }
    if (Number(num) === 2) {
      this.setState({ openData: true, arrayData: arrayConvert });
    }
    if (Number(num) === 3) {
      this.setState({ openData: true, arrayData: arrayFailed });
    }
  };

  handleChangeFiler = (e, isStartDate) => {
    const name = isStartDate ? 'startDate' : 'endDate';
    const value = isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    const { dialogSelectionRange } = this.state;
    const newDialogSelectionRange = { ...dialogSelectionRange, [name]: value };

    // TT
    if (!newDialogSelectionRange.startDate && newDialogSelectionRange.endDate) {
      this.setState(state => ({ ...state, errorStartDateEndDate: true, errorTextStartDate: 'nh???p thi???u: "T??? ng??y"', errorTextEndDate: '' }));
    } else if (newDialogSelectionRange.startDate && !newDialogSelectionRange.endDate) {
      this.setState(state => ({ ...state, errorStartDateEndDate: true, errorTextStartDate: '', errorTextEndDate: 'nh???p thi???u: "?????n ng??y"' }));
    } else if (
      newDialogSelectionRange.startDate &&
      newDialogSelectionRange.endDate &&
      new Date(newDialogSelectionRange.endDate) < new Date(newDialogSelectionRange.startDate)
    ) {
      this.setState(state => ({
        ...state,
        errorStartDateEndDate: true,
        errorTextStartDate: '"T??? ng??y" ph???i nh??? h??n "?????n ng??y"',
        errorTextEndDate: '"?????n ng??y" ph???i l???n h??n "T??? ng??y"',
      }));
    } else {
      this.setState(state => ({ ...state, errorStartDateEndDate: false, errorTextStartDate: '', errorTextEndDate: '' }));
    }

    this.setState(state => ({ ...state, dialogSelectionRange: { ...newDialogSelectionRange } }));

    // this.setState(state => ({ ...state, filter: { ...state.filter, [name]: value } }));
  };

  handleCloseData = () => {
    this.setState({ openData: false });
  };

  handleSaveDate = () => {
    const { dialogSelectionRange } = this.state;
    let str = '';
    const x = new Date(dialogSelectionRange.startDate);
    const y = new Date(dialogSelectionRange.endDate);
    if (x.getTime() === y.getTime()) {
      str = `${moment(dialogSelectionRange.startDate).format('DD/MM/YYYY')}`;
    } else {
      str = `T??? ${moment(dialogSelectionRange.startDate).format('DD/MM/YYYY')} ?????n ${moment(dialogSelectionRange.endDate).format('DD/MM/YYYY')}`;
    }
    const start = `${moment(dialogSelectionRange.startDate).format('YYYY-MM-DD')}T00:00:00.000Z`;
    const end = `${moment(dialogSelectionRange.endDate).format('YYYY-MM-DD')}T23:59:00.000Z`;
    const params = {
      filter: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    };
    const params2 = {
      filter: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
        model: 'BusinessOpportunities',
      },
    };
    this.props.onGetItem(params);
    this.props.onGetLogs(params2);
    this.setState({ openPickDate: false, selectionRange: dialogSelectionRange, dateString: str });
  };

  handleSelect = ranges => {
    if (ranges.selection.endDate > new Date(moment().add(1, 'days'))) {
      return;
    }
    const range = {
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
      key: 'selection',
    };
    this.setState({
      dialogSelectionRange: range,
    });
  };
}

BusinessOpportunitiesReport.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  businessOpportunitiesReport: makeSelectBusinessOpportunitiesReport(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetItem: body => {
      dispatch(getItemByRangeAct(body));
    },
    onGetLogs: body => {
      dispatch(getLogsByRangeAct(body));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'businessOpportunitiesReport', reducer });
const withSaga = injectSaga({ key: 'businessOpportunitiesReport', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(BusinessOpportunitiesReport);
