import { call, put, takeLatest, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import {
  getContractSuccess,
  getContractFalse,
  getBillFalse,
  getBillSuccess,
  getTaskSuccess,
  getLogSuccessAct,
  getLogFailedAct,
  postLogSuccessAct,
  postLogFailedAct,
  getLogAct,
  mergeData,
  getCurencySuccess,
  getCurencyFailed,
} from './actions';
import request from '../../utils/request';
import { makeSelectCurrentStock } from '../Dashboard/selectors';
import {
  GET_CONTRACT_ACTION,
  GET_BILL_ACTION,
  GET_DATA,
  GET_LOG_ACTION,
  POST_LOG_ACTION,
  POST_SALE,
  CREATE_TRADING,
  CREATE_REMINDER,
  CREATE_MEETING,
  CREATE_VISIT,
  GET_CURENCY,
} from './constants';
import {
  GET_CONTRACT,
  API_BILLS,
  API_EXPENSES,
  API_PRICE,
  API_SERVICES_STOCK,
  API_LOG,
  API_PROFILE,
  API_SALE,
  API_STOCK,
  // API_TRADINGS,
  API_NOTIFY,
  API_MEETING,
  API_VISIT,
  API_CUSTOMERS,
  API_CREATE_TRADDING_BY_BUS,
  API_CURRENCY,
} from '../../config/urlConfig';
import { makeSelectDashboardPage } from './selectors';
import { serialize } from '../../utils/common';
import { changeSnackbar } from '../Dashboard/actions';
import { logNames } from '../../variable';

// Individual exports for testing

export function* fetchGetContracts(action) {
  try {
    // console.log(action);
    const data = yield call(request, `${GET_CONTRACT}?${serialize({ filter: action.query })}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    // console.log(data);
    yield put(getContractSuccess(data));
  } catch (err) {
    yield put(getContractFalse(err));
  }
}
export function* fetchGetBill(action) {
  try {
    // console.log(action);
    const data = yield call(request, `${API_BILLS}?${serialize({ filter: action.query })}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(getBillSuccess(data));
  } catch (err) {
    yield put(getBillFalse(err));
  }
}

export function* getData(actions) {
  try {
    let filterBodialog;
    let expenses;
    let sales;
    if (actions.isEditting === true) {
      if (actions.isTrading === true) {
        filterBodialog = serialize({
          filter: { exchangingAgreement: actions.id },
        });
        expenses = yield call(request, `${API_EXPENSES}?${filterBodialog}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        sales = yield call(request, `${API_PRICE}?${filterBodialog}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } else {
        filterBodialog = serialize({ filter: { businessOpportunities: actions.id } });

        expenses = yield call(request, `${API_EXPENSES}?${filterBodialog}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        sales = yield call(request, `${API_PRICE}?${filterBodialog}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }
    } else {
      expenses = { data: [] };
      sales = { data: [] };
    }

    let services;
    let stocks;
    let customers;

    if (actions.isEditting === true) {
      services = yield call(request, API_SERVICES_STOCK, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      stocks = yield call(request, API_STOCK, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      customers = yield call(request, API_CUSTOMERS, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    } else {
      services = { data: [] };
      stocks = { data: [] };
      customers = { data: [] };
    }
    const profile = yield call(request, API_PROFILE, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    yield put(getTaskSuccess(expenses.data, sales.data, services, stocks, profile, customers));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'L???y d??? li???u th???t b???i', variant: 'error' }));
  }
}
function* postSaleSaga(action) {
  try {
    const salePoint = yield select(makeSelectCurrentStock());
    action.data.salePoint = salePoint;
    yield call(request, API_SALE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(changeSnackbar({ status: true, message: 'Th??m m???i th??nh c??ng', variant: 'success' }));
    const reload = action.data.reload;
    yield put(mergeData({ reload: reload + 1 }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Th??m m???i th???t b???i', variant: 'error' }));
  }
}

export function* fetchGetLogs(action) {
  try {
    const currency = yield call(request, API_CURRENCY, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = yield call(request, `${API_LOG}?${serialize({ filter: action.query })}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    yield put(getLogSuccessAct({ logs: data.data, currency }));
    // console.log(mergeData);
  } catch (err) {
    yield put(getLogFailedAct(err));
  }
}

export function* getCurrency() {
  try {
    const currency = yield call(request, API_CURRENCY, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(getCurencySuccess(currency));
    // console.log(mergeData);
  } catch (err) {
    yield put(getCurencyFailed(err));
  }
}
export function* fetchPostLog(action) {
  try {
    const data = yield call(request, `${API_LOG}`, {
      method: 'POST',
      body: JSON.stringify(action.body),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      },
    });

    const { objectId } = data;
    yield put(postLogSuccessAct(data));
    yield put(getLogAct({ objectId }));
  } catch (err) {
    yield put(postLogFailedAct(err));
  }
}
function* createTrading(action) {
  try {
    // console.log('action', action);
    const addTrading = yield call(request, `${API_CREATE_TRADDING_BY_BUS}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (addTrading) {
      yield put(changeSnackbar({ status: true, message: 'T???o trao ?????i th???a thu???n th??nh c??ng', variant: 'success' }));
      yield put(push(`/crm/ExchangingAgreement/${addTrading.data._id}`));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'T???o trao ?????i th???a thu???n th???t b???i', variant: 'error' }));
  }
}
export function* createReminder(action) {
  const token = localStorage.getItem('token');
  try {
    if (action.reminder.id) {
      const updateReminder = yield call(request, `${API_NOTIFY}/${action.reminder.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.reminder),
      });
      if (updateReminder) {
        yield put(changeSnackbar({ status: true, message: 'C???p nh???t nh???c l???ch th??nh c??ng', variant: 'success' }));

        const dashboardPage = yield select(makeSelectDashboardPage());

        const currentEmployee = dashboardPage.profile;

        const employee = {
          employeeId: currentEmployee._id,
          name: currentEmployee.name,
          code: currentEmployee.code,
        };
        const newLog = {
          content: JSON.stringify({ reminderId: updateReminder._id, content: `Nh???c l???ch ${updateReminder.title} ???? ???????c s???a` }),
          employee,
          model: 'BusinessOpportunities',
          type: logNames.REMINDER,
          objectId: action.id,
        };

        try {
          const createdLog = yield call(request, `${API_LOG}/${action.reminder.logId}`, {
            method: 'PUT',
            body: JSON.stringify(newLog),
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-type': 'application/json',
            },
          });
          if (createdLog) {
            const { objectId } = createdLog;
            yield put(getLogAct({ objectId }));
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      }
    } else {
      const createdReminder = yield call(request, `${API_NOTIFY}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.reminder),
      });
      if (createdReminder) {
        yield put(changeSnackbar({ status: true, message: 'T???o nh???c l???ch th??nh c??ng!', variant: 'success' }));

        const dashboardPage = yield select(makeSelectDashboardPage());

        const currentEmployee = dashboardPage.profile;

        const employee = {
          employeeId: currentEmployee._id,
          name: currentEmployee.name,
          code: currentEmployee.code,
        };
        const newLog = {
          content: JSON.stringify({ reminderId: createdReminder._id, content: `Nh???c l???ch ${createdReminder.title} ???? ???????c t???o` }),
          employee,
          model: 'BusinessOpportunities',
          type: logNames.REMINDER,
          objectId: action.id,
        };

        try {
          const createdLog = yield call(request, `${API_LOG}`, {
            method: 'POST',
            body: JSON.stringify(newLog),
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-type': 'application/json',
            },
          });
          if (createdLog) {
            const { objectId } = createdLog;
            yield put(getLogAct({ objectId }));
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      }
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'T???o nh???c l???ch th???t b???i', variant: 'error' }));
  }
}
export function* createMeeting(action) {
  const token = localStorage.getItem('token');

  try {
    if (action.meeting.logId) {
      const createdMeeting = yield call(request, `${API_MEETING}/${action.meeting._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.meeting),
      });
      if (createdMeeting) {
        yield put(changeSnackbar({ status: true, message: 'C???p nh???t l???ch h???p th??nh c??ng', variant: 'success' }));
        const dashboardPage = yield select(makeSelectDashboardPage());
        const currentEmployee = dashboardPage.profile;
        const employee = {
          employeeId: currentEmployee._id,
          name: currentEmployee.name,
          code: currentEmployee.code,
        };
        const newLog = {
          content: JSON.stringify({ meetingId: createdMeeting._id, content: `L???ch h???p ${createdMeeting && createdMeeting.data && createdMeeting.data.name || ""} ???? ???????c s???a!` }),
          employee,
          model: 'BusinessOpportunities',
          type: logNames.MEETING,
          objectId: action.id,
        };
        try {
          const createdLog = yield call(request, `${API_LOG}/${action.meeting.logId}`, {
            method: 'PUT',
            body: JSON.stringify(newLog),
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-type': 'application/json',
            },
          });
          if (createdLog) {
            const { objectId } = createdLog;
            yield put(getLogAct({ objectId }));
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      }
    } else {
      const createdMeeting = yield call(request, `${API_MEETING}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.meeting),
      });
      if (createdMeeting) {
        yield put(changeSnackbar({ status: true, message: 'T???o l???ch h???p th??nh c??ng', variant: 'success' }));
        console.log(action, "createdMeeting")
        if (action.clearInput && typeof action.clearInput === 'function') action.clearInput();

        const dashboardPage = yield select(makeSelectDashboardPage());
        const currentEmployee = dashboardPage.profile;
        const employee = {
          employeeId: currentEmployee._id,
          name: currentEmployee.name,
          code: currentEmployee.code,
        };
        const newLog = {
          content: JSON.stringify({ meetingId: createdMeeting.data && createdMeeting.data._id, content: `L???ch h???p ${createdMeeting && createdMeeting.data && createdMeeting.data.name || ""} ???? ???????c t???o!` }),
          employee,
          model: 'BusinessOpportunities',
          type: logNames.MEETING,
          objectId: action.id,
          meetingId: createdMeeting.data && createdMeeting.data._id
        };
        console.log(newLog, 'newLog', API_LOG)
        try {
          const createdLog = yield call(request, `${API_LOG}`, {
            method: 'POST',
            body: JSON.stringify(newLog),
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-type': 'application/json',
            },
          });
          if (createdLog) {
            const { objectId } = createdLog;
            yield put(getLogAct({ objectId }));
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      }
    }
  } catch (err) {
    console.log(err, "err")
    const message = err && err.message.split("|")
    yield put(changeSnackbar({ status: true, message: message && Array.isArray(message) && message[0] || err.message || 'T???o l???ch h???p th???t b???i', variant: 'error' }));
  }
}
export function* createVisit(action) {
  const token = localStorage.getItem('token');
  try {
    const createdVisit = yield call(request, `${API_VISIT}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.visit),
    });
    if (createdVisit) {
      yield put(changeSnackbar({ status: true, message: 'T???o l???ch th??m doanh nghi???p th??nh c??ng', variant: 'success' }));
      const dashboardPage = yield select(makeSelectDashboardPage());
      const currentEmployee = dashboardPage.profile;
      const employee = {
        employeeId: currentEmployee._id,
        name: currentEmployee.name,
        code: currentEmployee.code,
      };
      const newLog = {
        content: JSON.stringify({
          visitId: createdVisit._id,
          content: `L???ch th??m doanh nghi???p ${createdVisit.businessName} ???????c t???o ${createdVisit.isImportant || createdVisit.isFinished || createdVisit.isRemindBefore
            ? `${createdVisit.isFinished ? '???? ho??n th??nh' : createdVisit.isImportant ? 'quan tr???ng' : 'nh???c tr?????c'}`
            : ''
            } `,
        }),
        employee,
        model: 'BusinessOpportunities',
        type: logNames.VISIT,
        objectId: action.id,
      };
      try {
        const createdLog = yield call(request, `${API_LOG}`, {
          method: 'POST',
          body: JSON.stringify(newLog),
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-type': 'application/json',
          },
        });
        if (createdLog) {
          const { objectId } = createdLog;
          yield put(getLogAct({ objectId }));
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'T???o l???ch th??m doanh nghi???p th???t b???i', variant: 'error' }));
  }
}
export default function* boDialogSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_CONTRACT_ACTION, fetchGetContracts);
  yield takeLatest(GET_BILL_ACTION, fetchGetBill);
  yield takeLatest(GET_DATA, getData);
  yield takeLatest(POST_SALE, postSaleSaga);
  yield takeLatest(GET_LOG_ACTION, fetchGetLogs);
  yield takeLatest(POST_LOG_ACTION, fetchPostLog);
  yield takeLatest(CREATE_TRADING, createTrading);
  yield takeLatest(CREATE_REMINDER, createReminder);
  yield takeLatest(CREATE_MEETING, createMeeting);
  yield takeLatest(CREATE_VISIT, createVisit);
  yield takeLatest(GET_CURENCY, getCurrency);
}
