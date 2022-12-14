import { takeLatest, call, put } from 'redux-saga/effects';
import { getDataSuccess, addSetCriteriaSuccess, addCriteriaSuccess, putCriteriaSuccess, getItemSuccess, deleteCriteriaSuccess } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import request from '../../utils/request';
import { API_ORIGANIZATION, API_USERS, API_CRITERIA, API_CUSTOMERS, API_SUPPLIERS, API_CATEGORY_STOCK, API_STOCK } from '../../config/urlConfig';
import { GET_DATA, ADD_SET_CRITERIA, ADD_CRITERIA, PUT_CRITERIA, GET_ITEM, DELETE_CRITERIA } from './constants';
// Individual exports for testing

export function* getDataSaga() {
  try {
    const departments = yield call(request, API_ORIGANIZATION, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    const employeess = yield call(request, API_USERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const criterias = yield call(request, API_CRITERIA, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const customers = yield call(request, API_CUSTOMERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const suppliers = yield call(request, API_SUPPLIERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const categoryStock = yield call(request, API_CATEGORY_STOCK, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const products = yield call(request, API_STOCK, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    yield put(getDataSuccess(departments, employeess, criterias, customers.data, suppliers.data, categoryStock, products.data));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'L???y d??? li???u th???t b???i', variant: 'error' }));
  }
}

function* addSetCriteriaSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/criterionType`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(addSetCriteriaSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Th??m m???i th??nh c??ng', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: error.message || 'Th??m m???i th???t b???i', variant: 'error' }));
  }
}

function* addCriteriaSaga(action) {
  try {
    const data = yield call(request, API_CRITERIA, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(addCriteriaSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Th??m m???i th??nh c??ng', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Th??m m???i th???t b???i', variant: 'error' }));
  }
}

function* putCriteriaSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(putCriteriaSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Th??m m???i th??nh c??ng', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'C???p nh???t th???t b???i', variant: 'error' }));
  }
}

function* getItemSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    yield put(getItemSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'L???y ti??u ch?? th???t b???i', variant: 'error' }));
  }
}

function* deleteCriteriaSaga(action) {
  try {
    const data = yield call(request, API_CRITERIA, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.ids }),
    });
    yield put(deleteCriteriaSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'X??a th??nh c??ng', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'X??a th???t b???i', variant: 'error' }));
  }
}

export default function* criteriaPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, getDataSaga);
  yield takeLatest(ADD_SET_CRITERIA, addSetCriteriaSaga);
  yield takeLatest(ADD_CRITERIA, addCriteriaSaga);
  yield takeLatest(PUT_CRITERIA, putCriteriaSaga);
  yield takeLatest(GET_ITEM, getItemSaga);
  yield takeLatest(DELETE_CRITERIA, deleteCriteriaSaga);
}
