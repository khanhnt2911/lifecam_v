/* eslint-disable no-useless-escape */
import { call, put, select, takeLatest } from 'redux-saga/effects';
import qs from 'qs';
import { API_STATUS_CRMCONFIG, API_SOURCE_CRMCONFIG, API_CURRENCY, API_MONEY, API_LOCATION, API_TAX } from '../../config/urlConfig';
import lodash from 'lodash';
import request from '../../utils/request';
import { setState } from '../ListPage/actions';
import { makeSelectBody } from './selectors';
import { serialize } from 'utils/common';
import { makeSelectRows } from '../ListPage/selectors';
import {
  fetchAllStatusFailAction,
  fetchAllStatusSuccessAction,
  addStatusSuccessAction,
  editCRMStatusSuccessAction,
  editCRMStatusFailAction,
  deleteCRMStatusSuccessAction,
  deleteCRMStatusFailAction,
  addStatusFailAction,
  updateStatusFailAction,
  updateStatusSuccessAction,
  deleteStatusSuccessAction,
  deleteStatusFailAction,
  updateStatusIndexSuccessAction,
  updateStatusIndexFailAction,
  fetchAllSourcesAction,
  fetchAllSourcesFailAction,
  fetchAllSourcesSuccessAction,
  addSourceSuccessAction,
  addSourceFailAction,
  editSourceSuccessAction,
  editSourceFailAction,
  updateSourcesFailAction,
  updateSourcesSuccessAction,
  deleteSourcesSuccessAction,
  deleteSourcesFailAction,
  deleteCRMSourcesSuccessAction,
  deleteCRMSourcesFailAction,
  fetchAllCurrencySuccess,
  fetchAllCurrencyFail,
  addCurrencySuccessAction,
  updateCurrencySuccessAction,
  // updateCurrencyFailAction,
  getMoneySuccess,
  getMoneyFail,
  getLocationSuccess,
  getLocationFail,
  fetchAllStatusAction,
  getTaxFail,
  getTaxSuccess,
  addTaxFail,
  addTaxSuccess,
  addTaxLevelSuccess,
  addTaxLevelFail,
  resetAllSourceSuccess,
  resetAllSourceFailure,
  resetAllStatusSuccess,
  resetAllStatusFailure,
  // updateTaxLevelSuccess,
} from './actions';
import {
  GET_ALL_STATUS,
  ADD_STATUS,
  DELETE_STATUS,
  UPDATE_STATUS,
  UPDATE_STATUS_INDEX,
  GET_ALL_SOURCES,
  ADD_SOURCE,
  EDIT_SOURCE,
  DELETE_SOURCES,
  DELETE_CRM_SOURCES,
  UPDATE_SOURCE,
  GET_ALL_CURRENCY,
  ADD_CURRENCY,
  UPDATE_CURRENCY,
  GET_MONEY,
  GET_LOCATION,
  ADD_CRM_STATUS,
  EDIT_CRM_STATUS,
  DELETE_CRM_STATUS,
  ADD_LOCATION,
  UPDATE_LOCATION,
  GET_TAX,
  ADD_TAX,
  UPDATE_TAX,
  ADD_TAX_LEVEL,
  RESET_ALL_SOURCE,
  RESET_ALL_STATUS,
} from './constants';
import { changeSnackbar } from '../Dashboard/actions';
function convertToSlug(text) {
  let slug;
  const title = text;
  // L???y text t??? th??? input title

  // ?????i ch??? hoa th??nh ch??? th?????ng
  slug = title.toLowerCase();

  // ?????i k?? t??? c?? d???u th??nh kh??ng d???u
  slug = slug.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/gi, 'a');
  slug = slug.replace(/??|??|???|???|???|??|???|???|???|???|???/gi, 'e');
  slug = slug.replace(/i|??|??|???|??|???/gi, 'i');
  slug = slug.replace(/??|??|???|??|???|??|???|???|???|???|???|??|???|???|???|???|???/gi, 'o');
  slug = slug.replace(/??|??|???|??|???|??|???|???|???|???|???/gi, 'u');
  slug = slug.replace(/??|???|???|???|???/gi, 'y');
  slug = slug.replace(/??/gi, 'd');
  // X??a c??c k?? t??? ?????t bi???t
  slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
  // ?????i kho???ng tr???ng th??nh k?? t??? g???ch ngang
  slug = slug.replace(/ /gi, '');
  // ?????i nhi???u k?? t??? g???ch ngang li??n ti???p th??nh 1 k?? t??? g???ch ngang
  // Ph??ng tr?????ng h???p ng?????i nh???p v??o qu?? nhi???u k?? t??? tr???ng
  slug = slug.replace(/\-\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-/gi, '-');
  slug = slug.replace(/\-\-/gi, '-');
  // X??a c??c k?? t??? g???ch ngang ??? ?????u v?? cu???i
  slug = `@${slug}@`;
  // eslint-disable-next-line no-useless-escape
  slug = slug.replace(/\@\-|\-\@|\@/gi, '');
  // In slug ra textbox c?? id ???slug???
  return slug;
}
export function* fetchAddCRMStatus(action) {
  const token = localStorage.getItem('token');
  const code = convertToSlug(action.body);
  try {
    const addStatus = yield call(request, `${API_STATUS_CRMCONFIG}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: action.body, code, type: action.types }),
    });
    if (addStatus) {
      yield put(changeSnackbar({ status: true, message: 'Th??m m???i c???u h??nh th??nh c??ng', variant: 'success' }));
      yield put(fetchAllStatusAction(action.types));
    }
  } catch (err) {
    yield put(addStatusFailAction(err, 'Th??m m???i c???u h??nh th???t b???i'));
  }
}

export function* fetchEditCRMStatus(action) {
  const token = localStorage.getItem('token');
  try {
    const editStatus = yield call(request, `${API_STATUS_CRMCONFIG}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: action.body }),
    });
    if (editStatus) {
      yield put(changeSnackbar({ status: true, message: 'C???p nh???t c???u h??nh th??nh c??ng', variant: 'success' }));
      yield put(fetchAllStatusAction(action.types));
    }
  } catch (err) {
    yield put(editCRMStatusFailAction(err, 'C???p nh???t c???u h??nh th???t b???i'));
  }
}

export function* fetchDeleteCRMStatus(action) {
  const token = localStorage.getItem('token');
  // const code = convertToSlug(action.body);
  try {
    const delteStatus = yield call(request, `${API_STATUS_CRMCONFIG}/${action.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // body: qs.stringify({ title: action.body }),
    });
    if (delteStatus) {
      yield put(changeSnackbar({ status: true, message: 'X??a c???u h??nh th??nh c??ng', variant: 'success' }));
      yield put(fetchAllStatusAction(action.types));
    }
  } catch (err) {
    yield put(deleteCRMStatusFailAction(err, 'X??a c???u h??nh th???t b???i'));
  }
}

export function* fetchGetAllStatus(type) {
  const filters = {
    filter: { type: type.id },
  };
  let allF = serialize(filters);
  try {
    let data = yield call(request, `${API_STATUS_CRMCONFIG}?${allF}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (data && Array.isArray(data) && data.length) {
      let temp = []
      data.map((el) => {
        let itemCrmStatus = el
        let dataClone = el.data
        if (dataClone && Array.isArray(dataClone) && dataClone.length) {
          dataClone = lodash.sortBy(dataClone, ['code']);
        }
        itemCrmStatus.data = dataClone
        temp.push(itemCrmStatus)
      })
      data = temp
    }
    localStorage.setItem('crmStatus', JSON.stringify(data));
    if (data) {
      yield put(fetchAllStatusSuccessAction(data));
    } else {
      yield put(fetchAllStatusSuccessAction({}));
    }
  } catch (err) {
    console.log(err, 'err')
    yield put(fetchAllStatusFailAction(err));
  }
}
export function* fetchAddStatus(action) {
  const token = localStorage.getItem('token');
  // const reg = /\w/g;
  const reg = /\w/g;
  const regType = /^[a-zA-Z0-9]+$/
  const checkname = reg.test(action.body.name)
  const checktype = regType.test(action.body.type);
  try {
    const addStatus = yield call(request, `${API_STATUS_CRMCONFIG}/createitem/${action.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    console.log(addStatus, 'addStatus')
    if (addStatus && checkname && checktype) {
      yield put(changeSnackbar({ status: true, message: 'Th??m tr???ng th??i th??nh c??ng', variant: 'success' }));
      yield put(fetchAllStatusAction(action.types));
    } else {
      yield put(addStatusFailAction(err, 'Th??m tr???ng th??i th???t b???i'));
    }
  } catch (err) {
    yield put(addStatusFailAction(err, 'Th??m tr???ng th??i th???t b???i'));
  }
}
export function* fetchDeleteStatus(action) {
  const token = localStorage.getItem('token');

  try {
    const deletedStatus = yield call(request, `${API_STATUS_CRMCONFIG}/deleteitem/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: action.statusId }),
    });

    if (deletedStatus) {
      yield put(changeSnackbar({ status: true, message: 'X??a tr???ng th??i th??nh c??ng', variant: 'success' }));
      yield put(fetchAllStatusAction(action.types));
    }
  } catch (err) {
    yield put(deleteStatusFailAction(err, 'X??a tr???ng th??i th???t b???i'));
  }
}
export function* fetchUpdateStatus(action) {
  const token = localStorage.getItem('token');
  const newData = action.body;
  newData.id = newData._id;
  delete newData._id;
  try {
    const updateStatus = yield call(request, `${API_STATUS_CRMCONFIG}/updateitem/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(newData),
    });
    if (updateStatus) {
      yield put(changeSnackbar({ status: true, message: 'C???p nh???t tr???ng th??i th??nh c??ng', variant: 'success' }));
      yield put(fetchAllStatusAction(action.types));
    }
  } catch (err) {
    yield put(updateStatusFailAction(err, 'C???p nh???t tr???ng th??i th???t b???i'));
  }
}
export function* fetchUpdateStatusIndex(action) {
  const token = localStorage.getItem('token');
  try {
    const updateStatus = yield call(request, `${API_STATUS_CRMCONFIG}/updateIndex/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: action.body }),
    });
    if (updateStatus) {
      yield put(changeSnackbar({ status: true, message: 'C???p nh???t tr???ng th??i th??nh c??ng', variant: 'success' }));
      yield put(fetchAllStatusAction());
    }
  } catch (err) {
    yield put(updateStatusIndexFailAction(err, 'C???p nh???t tr???ng th??i th???t b???i'));
  }
}
export function* resetAllStatus(action) {
  const token = localStorage.getItem('token');
  try {
    const response = yield call(request, `${API_STATUS_CRMCONFIG}/reset`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Ho??n t??c d??? li???u c???u h??nh tr???ng th??i th??nh c??ng', variant: 'success' }));
      yield put(fetchAllStatusAction());
    }
  } catch (err) {
    yield put(resetAllStatusFailure(data));
    yield put(changeSnackbar({ status: true, message: 'Ho??n t??c d??? li???u c???u h??nh tr???ng th??i th???t b???i', variant: 'error' }));
  }
}

// SOURCES

export function* fetchGetAllSources(type) {
  const filters = {
    filter: { type: type.id },
  };
  let allF = serialize(filters);
  try {
    const data = yield call(request, `${API_SOURCE_CRMCONFIG}?${allF}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      yield put(fetchAllSourcesSuccessAction(data));
    } else {
      yield put(fetchAllSourcesSuccessAction({}));
    }
  } catch (err) {
    yield put(fetchAllSourcesFailAction(err));
  }
}
export function* fetchAddSource(action) {
  const token = localStorage.getItem('token');
  try {
    const addSource = yield call(request, API_SOURCE_CRMCONFIG, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: action.body, type: action.types }),
    });

    if (addSource) {
      yield put(changeSnackbar({ status: true, message: 'Th??m c???u h??nh th??nh c??ng', variant: 'success' }));
      yield put(fetchAllSourcesAction(action.types));
    }
  } catch (err) {
    yield put(addSourceFailAction(err, 'Th??m c???u h??nh th???t b???i'));
  }
}

export function* fetchEditSource(action) {
  const token = localStorage.getItem('token');

  try {
    const editSource = yield call(request, `${API_SOURCE_CRMCONFIG}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: action.body }),
    });

    if (editSource) {
      yield put(changeSnackbar({ status: true, message: 'C???p nh???t c???u h??nh th??nh c??ng', variant: 'success' }));
      yield put(fetchAllSourcesAction(action.types));
    }
  } catch (err) {
    yield put(editSourceFailAction(err, 'C???p nh???t c???u h??nh th???t b???i'));
  }
}

export function* fetchDeleteSources(action) {
  const token = localStorage.getItem('token');

  try {
    const deletedSources = yield call(request, `${API_SOURCE_CRMCONFIG}/${action.body}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.body }),
    });
    if (deletedSources) {
      yield put(changeSnackbar({ status: true, message: 'X??a c???u h??nh th??nh c??ng', variant: 'success' }));
      yield put(fetchAllSourcesAction());
    }
  } catch (err) {
    yield put(deleteSourcesFailAction(err, 'X??a ki???u th???t b???i'));
  }
}
export function* fetchDeleteCRMSource(action) {
  const token = localStorage.getItem('token');

  try {
    const deleteSource = yield call(request, `${API_SOURCE_CRMCONFIG}/${action.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (deleteSource) {
      yield put(changeSnackbar({ status: true, message: 'X??a c???u h??nh th??nh c??ng', variant: 'success' }));
      yield put(fetchAllSourcesAction(action.types));
    }
  } catch (err) {
    yield put(deleteCRMSourcesFailAction(err, 'X??a c???u h??nh th???t b???i'));
  }
}

export function* fetchUpdateSources(action) {
  const token = localStorage.getItem('token');

  try {
    const updateSources = yield call(request, `${API_SOURCE_CRMCONFIG}/${action.param._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: action.param.title, data: action.body }),
    });

    if (updateSources) {
      const crmSource = JSON.parse(localStorage.getItem('crmSource'));
      const data = [...crmSource];
      data[62] = { ...updateSources };
      localStorage.setItem('crmSource', JSON.stringify(data));
      yield put(changeSnackbar({ status: true, message: 'C???p nh???t c???u h??nh th??nh c??ng', variant: 'success' }));
      yield put(fetchAllSourcesAction(action.types));
    }
  } catch (err) {
    yield put(updateSourcesFailAction(err, 'C???p nh???t c???u h??nh th???t b???i'));
  }
}

export function* resetAllSources(action) {
  const token = localStorage.getItem('token');

  try {
    const response = yield call(request, `${API_SOURCE_CRMCONFIG}/reset`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Ho??n t??c d??? li???u c???u h??nh lo???i th??nh c??ng', variant: 'success' }));
      yield put(fetchAllSourcesAction());
    }
  } catch (err) {
    yield put(resetAllSourcesFailure(data));
    yield put(changeSnackbar({ status: true, message: 'Ho??n t??c d??? li???u c???u h??nh lo???i th???t b???i', variant: 'error' }));
  }
}
// Currency

export function* fetchAllCurrency() {
  try {
    const currency = yield call(request, API_CURRENCY, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (currency) {
      yield put(fetchAllCurrencySuccess(currency));
    } else {
      yield put(fetchAllCurrencyFail());
    }
  } catch (err) {
    yield put(fetchAllCurrencyFail(err, 'C???p nh???t lo???i t??nh th???t b???i'));
  }
}

export function* addCurrency(action) {
  try {
    yield call(request, API_CURRENCY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(addCurrencySuccessAction());
    yield put(changeSnackbar({ status: true, message: 'Th??m m???i Ti???n th??nh c??ng', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Th??m m???i Ti???n th???t b???i', variant: 'error' }));
  }
}

export function* updateCurrency(action) {
  try {
    const data = yield call(request, `${API_CURRENCY}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (data) {
      yield put(updateCurrencySuccessAction(data));
      yield put(changeSnackbar({ status: true, message: 'C???p nh???t Ti???n th??nh c??ng', variant: 'success' }));
      const rows = yield select(makeSelectRows());
      const newRows = rows.map(item => (item._id === action.id ? { ...item, base: 'C??' } : item));
      yield put(setState({ rows: newRows }));
    } else {
      yield put(changeSnackbar({ status: true, message: 'C???p nh???t Ti???n th???t b???i', variant: 'error' }));
    }
  } catch (err) {
    // yield put(updateCurrencyFailAction(err, 'C???p nh???t Ti???n th???t b???i'));
    yield put(changeSnackbar({ status: true, message: 'C???p nh???t Ti???n th???t b???i', variant: 'error' }));
  }
}

export function* getMoney() {
  try {
    const money = yield call(request, API_MONEY, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (money) {
      yield put(getMoneySuccess(money));
    } else {
      yield put(getMoneyFail());
    }
  } catch (err) {
    yield put(getMoneyFail(err, 'C???p nh???t lo???i t??nh th???t b???i'));
  }
}

// Location

export function* getLocation() {
  try {
    const location = yield call(request, API_LOCATION, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (location) {
      yield put(getLocationSuccess(location));
    } else {
      yield put(getLocationFail());
    }
  } catch (err) {
    yield put(getLocationFail(err, 'L???y d??? li???u th???t b???i'));
  }
}
export function* addLocation(action) {
  try {
    yield call(request, API_LOCATION, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(addCurrencySuccessAction());
    yield put(changeSnackbar({ status: true, message: 'Th??m m???i ?????a ??i???m th??nh c??ng', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Th??m m???i ?????a ??i???m th???t b???i', variant: 'error' }));
  }
}
export function* updateLocation(action) {
  try {
    const data = yield call(request, `${API_LOCATION}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (data) {
      yield put(changeSnackbar({ status: true, message: 'C???p nh???t ?????a ??i???m th??nh c??ng', variant: 'success' }));
    } else {
      yield put(changeSnackbar({ status: true, message: 'C???p nh???t ?????a ??i???m th???t b???i', variant: 'error' }));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'C???p nh???t ?????a ??i???m th???t b???i', variant: 'error' }));
  }
}

// TAX
export function* getTax() {
  try {
    const tax = yield call(request, API_TAX, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (tax) {
      yield put(getTaxSuccess(tax));
    } else {
      yield put(getTaxFail());
    }
  } catch (err) {
    yield put(getTaxFail(err, 'L???y d??? li???u th???t b???i'));
  }
}

export function* addTax(action) {
  try {
    yield call(request, API_TAX, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(addTaxSuccess());
    yield put(changeSnackbar({ status: true, message: 'Th??m m???i Thu??? th??nh c??ng', variant: 'success' }));
  } catch (error) {
    yield put(addTaxFail());
    yield put(changeSnackbar({ status: true, message: 'Th??m m???i Thu??? th???t b???i', variant: 'error' }));
  }
}
export function* updateTax(action) {
  try {
    const data = yield call(request, `${API_TAX}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (data) {
      yield put(changeSnackbar({ status: true, message: 'C???p nh???t Thu??? th??nh c??ng', variant: 'success' }));
    } else {
      yield put(changeSnackbar({ status: true, message: 'C???p nh???t Thu??? th???t b???i', variant: 'error' }));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'C???p nh???t Thu??? th???t b???i', variant: 'error' }));
  }
}
export function* addTaxLevel(action) {
  try {
    const data = yield call(request, `${API_TAX}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(addTaxLevelSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Th??m m???i m???c thu??? th??nh c??ng', variant: 'success' }));
  } catch (error) {
    yield put(addTaxLevelFail());
    yield put(changeSnackbar({ status: true, message: 'Th??m m???i m???c thu??? th???t b???i', variant: 'error' }));
  }
}

// Individual exports for testing
export default function* crmConfigPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ALL_STATUS, fetchGetAllStatus);
  yield takeLatest(ADD_STATUS, fetchAddStatus);
  yield takeLatest(ADD_CRM_STATUS, fetchAddCRMStatus);
  yield takeLatest(EDIT_CRM_STATUS, fetchEditCRMStatus);
  yield takeLatest(DELETE_CRM_STATUS, fetchDeleteCRMStatus);
  yield takeLatest(DELETE_STATUS, fetchDeleteStatus);
  yield takeLatest(UPDATE_STATUS, fetchUpdateStatus);
  yield takeLatest(UPDATE_STATUS_INDEX, fetchUpdateStatusIndex);
  yield takeLatest(GET_ALL_SOURCES, fetchGetAllSources);
  yield takeLatest(ADD_SOURCE, fetchAddSource);
  yield takeLatest(EDIT_SOURCE, fetchEditSource);
  yield takeLatest(DELETE_SOURCES, fetchDeleteSources);
  yield takeLatest(DELETE_CRM_SOURCES, fetchDeleteCRMSource);
  yield takeLatest(UPDATE_SOURCE, fetchUpdateSources);
  yield takeLatest(GET_ALL_CURRENCY, fetchAllCurrency);
  yield takeLatest(ADD_CURRENCY, addCurrency);
  yield takeLatest(UPDATE_CURRENCY, updateCurrency);
  yield takeLatest(GET_MONEY, getMoney);
  yield takeLatest(GET_LOCATION, getLocation);
  yield takeLatest(ADD_LOCATION, addLocation);
  yield takeLatest(UPDATE_LOCATION, updateLocation);
  yield takeLatest(GET_TAX, getTax);
  yield takeLatest(ADD_TAX, addTax);
  yield takeLatest(UPDATE_TAX, updateTax);
  yield takeLatest(ADD_TAX_LEVEL, addTaxLevel);
  yield takeLatest(RESET_ALL_STATUS, resetAllStatus);
  yield takeLatest(RESET_ALL_SOURCE, resetAllSources);
}
