// import { take, call, put, select } from 'redux-saga/effects';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import qs from 'qs';
import lodash from 'lodash';
import request from '../../utils/request';
import { API_UNIT_STOCK, API_SERVICES_STOCK, API_CATEGORY_STOCK, API_TAG_STOCK, API_ORIGIN, API_ASSET_TYPE_STOCK } from '../../config/urlConfig';
import {
  fetchAllUnitsFailAction,
  fetchAllUnitsSuccessAction,
  addUnitSuccessAction,
  addUnitFailAction,
  updateUnitsFailAction,
  updateUnitsSuccessAction,
  deleteUnitsSuccessAction,
  deleteUnitsFailAction,
  getAllServicesSucsessAction,
  addServiceSuccessAction,
  updateServiceSuccessAction,
  updateServiceFailAction,
  addServiceFailAction,
  fetchAllCategoryAction,
  fetchAllCategorySuccessAction,
  deleteServicesFailAction,
  deleteServicesSucsessAction,
  addCategorySuccessAction,
  addCategoryFailAction,
  updateCategorySuccessAction,
  updateCategoryFailAction,
  deleteCategoryFailAction,
  deleteCategorySuccessAction,
  // getAllServicesAction,
  fetchAllTagsFailAction,
  fetchAllTagsSuccessAction,
  addTagSuccessAction,
  addTagFailAction,
  updateTagsFailAction,
  updateTagsSuccessAction,
  deleteTagsSuccessAction,
  deleteTagsFailAction,
  fetchAllTagsAction,
  fetchAllOriginAction,
  fetchAllOriginSuccessAction,
  addOriginSuccessAction,
  addOriginFailAction,
  updateOriginSuccessAction,
  updateOriginFailAction,
  deleteOriginFailAction,
  deleteOriginSuccessAction,
  //ASET TYPE
  fetchAllAssetTypeFailAction,
  fetchAllAssetTypeSuccessAction,
  addAssetTypeSuccessAction,
  addAssetTypeFailAction,
  updateAssetTypeFailAction,
  updateAssetTypeSuccessAction,
  deleteAssetTypeSuccessAction,
  deleteAssetTypeFailAction,
  fetchAllAssetTypeAction,
} from './actions';
import { makeSelectBody } from './selectors';
import {
  GET_ALL_UNITS,
  ADD_UNIT,
  DELETE_UNITS,
  UPDATE_UNIT,
  GET_ALL_SERVICES,
  GET_ALL_CATEGORY,
  DELETE_SERVICES,
  ADD_SERVICE,
  ADD_CATEGORY,
  UPDATE_SERVICE,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  GET_ALL_TAGS,
  ADD_TAG,
  DELETE_TAGS,
  UPDATE_TAG,
  GET_ALL_ASSET_TYPE,
  ADD_ASSET_TYPE,
  DELETE_ASSET_TYPE,
  UPDATE_ASSET_TYPE,
  GET_ALL_ORIGIN,
  ADD_ORIGIN,
  DELETE_ORIGIN,
  UPDATE_ORIGIN,
} from './constants';

export function* fetchGetAllUnits() {
  try {
    const data = yield call(request, API_UNIT_STOCK, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      yield put(fetchAllUnitsSuccessAction(data));
    } else {
      yield put(fetchAllUnitsSuccessAction({}));
    }
  } catch (err) {
    yield put(fetchAllUnitsFailAction(err));
  }
}
export function* fetchAddUnit(action) {
  const token = localStorage.getItem('token');
  try {
    // console.log('action', action.body);
    const addUnit = yield call(request, API_UNIT_STOCK, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(action.body),
    });
    console.log(addUnit, 'addUnit')
    if (addUnit) {
      let oldUnits = yield select(makeSelectBody('units'));
      console.log(oldUnits, "oldUnits 1")
      oldUnits ? oldUnits = oldUnits : oldUnits = []
      console.log(oldUnits, "oldUnits 2")

      // oldUnits.push(addUnit.data);
      oldUnits.unshift(addUnit.data);

      yield put(addUnitSuccessAction(oldUnits, 'Th??m ????n v??? th??nh c??ng'));
    }
  } catch (err) {
    console.log(err, "err unit stock")
    yield put(addUnitFailAction(err, 'Th??m ????n v??? th???t b???i'));
  }
}
export function* fetchDeleteUnits(action) {
  const token = localStorage.getItem('token');

  try {
    const deletedUnits = yield call(request, `${API_UNIT_STOCK}/${action.body}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.body }),
    });
    if (deletedUnits) {
      const oldUnits = yield select(makeSelectBody('units'));

      oldUnits.splice(oldUnits.findIndex(d => d._id === deletedUnits.data._id), 1);

      yield put(deleteUnitsSuccessAction(oldUnits, 'X??a ????n v??? t??nh th??nh c??ng'));
    }
  } catch (err) {
    yield put(deleteUnitsFailAction(err, 'X??a ????n v??? t??nh th???t b???i'));
  }
}
export function* fetchUpdateUnits(action) {
  const token = localStorage.getItem('token');
  // console.log(action.body);
  try {
    const updateUnits = yield call(request, `${API_UNIT_STOCK}/${action.body._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (updateUnits) {
      const oldUnits = yield select(makeSelectBody('units'));

      oldUnits[oldUnits.findIndex(d => d._id === updateUnits.data._id)] = updateUnits.data;

      yield put(updateUnitsSuccessAction(oldUnits, 'C???p nh???t ????n v??? t??nh th??nh c??ng'));
    }
  } catch (err) {
    yield put(updateUnitsFailAction(err, 'C???p nh???t ????n v??? t??nh th???t b???i'));
  }
}

// SERVICES

export function* fetchGetAllServices() {
  try {
    const data = yield call(request, API_SERVICES_STOCK, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      yield put(getAllServicesSucsessAction(data));
    } else {
      // yield put(getAllServicesSucsessAction({}));
    }
  } catch (err) {
    // yield put(fetchAllUnitsFailAction(err));
  }
}
export function* fetchAddService(action) {
  const token = localStorage.getItem('token');

  try {
    const addService = yield call(request, API_SERVICES_STOCK, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(action.body),
    });
    if (addService) {
      let oldServices = yield select(makeSelectBody('services'));
      oldServices = [addService.data, ...oldServices];

      yield put(addServiceSuccessAction(oldServices, 'Th??m d???ch v??? th??nh c??ng'));
    }
  } catch (err) {
    yield put(addServiceFailAction(err, 'Th??m d???ch v??? th???t b???i'));
  }
}
export function* fetchUpdateService(action) {
  const token = localStorage.getItem('token');

  try {
    const updateService = yield call(request, `${API_SERVICES_STOCK}/${action.body._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (updateService) {
      const oldServices = yield select(makeSelectBody('services'));

      oldServices[oldServices.findIndex(d => d._id === updateService.data._id)] = updateService.data;

      yield put(updateServiceSuccessAction(oldServices, 'S???a d???ch v??? th??nh c??ng'));
    }
  } catch (err) {
    yield put(updateServiceFailAction(err, 'S???a d???ch v??? th???t b???i'));
  }
}
export function* fetchDeleteServices(action) {
  const token = localStorage.getItem('token');

  try {
    const deletedServices = yield call(request, `${API_SERVICES_STOCK}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.ids }),
    });
    if (deletedServices) {
      const oldServices = yield select(makeSelectBody('services'));

      const newServices = lodash.differenceBy(oldServices, deletedServices.data, '_id');

      yield put(deleteServicesSucsessAction(newServices, 'X??a d???ch v??? th??nh c??ng'));
    }
  } catch (err) {
    yield put(deleteServicesFailAction(err, 'X??a d???ch v??? th???t b???i'));
  }
}

// CATEGORY

export function* fetchGetAllCategory() {
  try {
    const data = yield call(request, `${API_CATEGORY_STOCK}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    // console.log(data);
    if (data) {
      yield put(fetchAllCategorySuccessAction(data));
    } else {
      // yield put(fetchAllUnitsSuccessAction({}));
    }
  } catch (err) {
    // yield put(fetchAllUnitsFailAction(err));
  }
}
export function* fetchAddCategory(action) {
  const token = localStorage.getItem('token');
  const fakeData = { ...action.body, ...{ description: 'test', isDisplayPOS: false } };
  try {
    // console.log('action', action.body);
    const addUnit = yield call(request, API_CATEGORY_STOCK, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(fakeData),
    });
    if (addUnit) {
      // const oldUnits = yield select(makeSelectBody('categories'));

      // oldUnits.push(addUnit.data);

      yield put(addCategorySuccessAction('Th??m danh m???c th??nh c??ng'));
      yield put(fetchAllCategoryAction());
    }
  } catch (err) {
    yield put(addCategoryFailAction(err, 'Th??m danh m???c th???t b???i'));
  }
}
export function* fetchDeleteCategory(action) {
  const token = localStorage.getItem('token');

  try {
    const deletedUnits = yield call(request, `${API_CATEGORY_STOCK}/${action.body}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(action.body),
    });
    if (deletedUnits) {
      // const oldUnits = yield select(makeSelectBody('units'));

      // oldUnits.splice(oldUnits.findIndex(d => d._id === deletedUnits.data._id), 1);

      yield put(deleteCategorySuccessAction('Xo?? danh m???c th??nh c??ng'));
      yield put(fetchAllCategoryAction());
    }
  } catch (err) {
    yield put(deleteCategoryFailAction(err, 'X??a danh m???c th???t b???i'));
  }
}
export function* fetchUpdateCategory(action) {
  const token = localStorage.getItem('token');
  // console.log(action.body);
  try {
    const updateUnits = yield call(request, `${API_CATEGORY_STOCK}/${action.body._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (updateUnits) {
      const oldUnits = yield select(makeSelectBody('units'));

      oldUnits[oldUnits.findIndex(d => d._id === updateUnits.data._id)] = updateUnits.data;

      yield put(updateCategorySuccessAction(oldUnits, 'C???p nh???t doanh m???c th??nh c??ng'));
      yield put(fetchAllCategoryAction());
    }
  } catch (err) {
    yield put(updateCategoryFailAction(err, 'C???p nh???t danh m???c th???t b???i'));
  }
}

// TAG

export function* fetchGetAllTags() {
  try {
    const data = yield call(request, API_TAG_STOCK, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      yield put(fetchAllTagsSuccessAction(data));
    } else {
      // yield put(fetchAllTagsSuccessAction({}));
    }
  } catch (err) {
    yield put(fetchAllTagsFailAction(err));
  }
}
export function* fetchAddTag(action) {
  const token = localStorage.getItem('token');
  const fakeData = { ...action.body, ...{ description: 'test' } };
  try {
    // console.log('action', action.body);
    const addTag = yield call(request, API_TAG_STOCK, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(fakeData),
    });
    if (addTag) {
      // const oldTags = yield select(makeSelectBody('tags'));

      // oldTags.push(addTag.data);

      yield put(addTagSuccessAction('Th??m lo???i th??nh c??ng'));
      yield put(fetchAllTagsAction());
    }
  } catch (err) {
    // yield put(addTagFailAction(err, 'Th??m lo???i th???t b???i'));
    yield put(addTagFailAction(err, 'M?? code n??y ???? t???n t???i'));
  }
}
export function* fetchDeleteTags(action) {
  const token = localStorage.getItem('token');

  try {
    const deletedTags = yield call(request, `${API_TAG_STOCK}/${action.body}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.body }),
    });
    if (deletedTags) {
      // const oldTags = yield select(makeSelectBody('tags'));

      // oldTags.splice(oldTags.findIndex(d => d._id === deletedTags.data._id), 1);

      yield put(deleteTagsSuccessAction('X??a lo???i t??nh th??nh c??ng'));
      yield put(fetchAllTagsAction());
    }
  } catch (err) {
    yield put(deleteTagsFailAction(err, 'X??a lo???i t??nh th???t b???i'));
  }
}
export function* fetchUpdateTags(action) {
  const token = localStorage.getItem('token');
  // console.log(action.body);
  try {
    const updateTags = yield call(request, `${API_TAG_STOCK}/${action.body._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (updateTags) {
      // const oldTags = yield select(makeSelectBody('units'));

      // oldTags[oldTags.findIndex(d => d._id === updateTags.data._id)] = updateTags.data;

      yield put(updateTagsSuccessAction('C???p nh???t lo???i t??nh th??nh c??ng'));
      yield put(fetchAllTagsAction());
    }
  } catch (err) {
    yield put(updateTagsFailAction(err, 'Code ???? t???n t???i'));
  }
}


// ASSET TYPE

export function* fetchGetAllAssetType() {
  try {
    const data = yield call(request, API_ASSET_TYPE_STOCK, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      yield put(fetchAllAssetTypeSuccessAction(data));
    } else {
      // yield put(fetchAllAssetTypeSuccessAction({}));
    }
  } catch (err) {
    yield put(fetchAllAssetTypeFailAction(err));
  }
}
export function* fetchAddAssetType(action) {
  const token = localStorage.getItem('token');
  const fakeData = { ...action.body, ...{ description: 'test' } };
  try {
    // console.log('action', action.body);
    const addAssetType = yield call(request, API_ASSET_TYPE_STOCK, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(fakeData),
    });
    if (addAssetType) {
      // const oldAssetType = yield select(makeSelectBody('tags'));

      // oldAssetType.push(addAssetType.data);

      yield put(addAssetTypeSuccessAction('Th??m lo???i t??i s???n th??nh c??ng'));
      yield put(fetchAllAssetTypeAction());
    }
  } catch (err) {
    yield put(addAssetTypeFailAction(err, 'Th??m lo???i t??i s???n th???t b???i'));
  }
}
export function* fetchDeleteAssetType(action) {
  const token = localStorage.getItem('token');

  try {
    const deletedAssetType = yield call(request, `${API_ASSET_TYPE_STOCK}/${action.body}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.body }),
    });
    if (deletedAssetType) {
      // const oldAssetType = yield select(makeSelectBody('tags'));

      // oldAssetType.splice(oldAssetType.findIndex(d => d._id === deletedAssetType.data._id), 1);

      yield put(deleteAssetTypeSuccessAction('X??a lo???i t??i s???n th??nh c??ng'));
      yield put(fetchAllAssetTypeAction());
    }
  } catch (err) {
    yield put(deleteAssetTypeFailAction(err, 'X??a lo???i t??i s???n th???t b???i'));
  }
}
export function* fetchUpdateAssetType(action) {
  const token = localStorage.getItem('token');
  // console.log(action.body);
  try {
    const updateAssetType = yield call(request, `${API_ASSET_TYPE_STOCK}/${action.body._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (updateAssetType) {
      // const oldAssetType = yield select(makeSelectBody('units'));

      // oldAssetType[oldAssetType.findIndex(d => d._id === updateAssetType.data._id)] = updateAssetType.data;

      yield put(updateAssetTypeSuccessAction('C???p nh???t lo???i t??nh th??nh c??ng'));
      yield put(fetchAllAssetTypeAction());
    }
  } catch (err) {
    yield put(updateAssetTypeFailAction(err, 'C???p nh???t lo???i t??nh th???t b???i'));
  }
}

// ORIGIN
export function* fetchGetAllOrigin() {
  try {
    const data = yield call(request, `${API_ORIGIN}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      yield put(fetchAllOriginSuccessAction(data));
    }
  } catch (err) {
    // test
  }
}
export function* fetchAddOrigin(action) {
  const token = localStorage.getItem('token');
  const fakeData = { ...action.body, ...{ description: 'test', isDisplayPOS: false } };
  try {
    const addUnit = yield call(request, API_ORIGIN, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(fakeData),
    });
    if (addUnit) {
      yield put(addOriginSuccessAction('Th??m xu???t x??? th??nh c??ng'));
      yield put(fetchAllOriginAction());
    }
  } catch (err) {
    yield put(addOriginFailAction(err, 'Th??m xu???t x??? th???t b???i'));
  }
}
export function* fetchDeleteOrigin(action) {
  const token = localStorage.getItem('token');

  try {
    const deletedUnits = yield call(request, `${API_ORIGIN}/${action.body}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (deletedUnits) {
      yield put(deleteOriginSuccessAction('Xo?? xu???t x??? th??nh c??ng'));
      yield put(fetchAllOriginAction());
    }
  } catch (err) {
    yield put(deleteOriginFailAction(err, 'X??a xu???t x??? th???t b???i'));
  }
}
export function* fetchUpdateOrigin(action) {
  const token = localStorage.getItem('token');

  try {
    const updateUnits = yield call(request, `${API_ORIGIN}/${action.body._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (updateUnits) {
      const oldUnits = yield select(makeSelectBody('origins'));

      oldUnits[oldUnits.findIndex(d => d._id === updateUnits.data._id)] = updateUnits.data;

      yield put(updateOriginSuccessAction(oldUnits, 'C???p nh???t xu???t x??? th??nh c??ng'));
      yield put(fetchAllOriginAction());
    }
  } catch (err) {
    yield put(updateOriginFailAction(err, 'C???p nh???t xu???t x??? th???t b???i'));
  }
}
export default function* stockConfigPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ALL_UNITS, fetchGetAllUnits);
  yield takeLatest(ADD_UNIT, fetchAddUnit);
  yield takeLatest(DELETE_UNITS, fetchDeleteUnits);
  yield takeLatest(UPDATE_UNIT, fetchUpdateUnits);
  // SERVICE
  yield takeLatest(GET_ALL_SERVICES, fetchGetAllServices);
  yield takeLatest(DELETE_SERVICES, fetchDeleteServices);
  yield takeLatest(ADD_SERVICE, fetchAddService);
  yield takeLatest(UPDATE_SERVICE, fetchUpdateService);
  // CATEGORY
  yield takeLatest(GET_ALL_CATEGORY, fetchGetAllCategory);
  yield takeLatest(ADD_CATEGORY, fetchAddCategory);
  yield takeLatest(UPDATE_CATEGORY, fetchUpdateCategory);
  yield takeLatest(DELETE_CATEGORY, fetchDeleteCategory);
  // TAG
  yield takeLatest(GET_ALL_TAGS, fetchGetAllTags);
  yield takeLatest(ADD_TAG, fetchAddTag);
  yield takeLatest(DELETE_TAGS, fetchDeleteTags);
  yield takeLatest(UPDATE_TAG, fetchUpdateTags);
  // ASSET TYPE
  yield takeLatest(GET_ALL_ASSET_TYPE, fetchGetAllAssetType);
  yield takeLatest(ADD_ASSET_TYPE, fetchAddAssetType);
  yield takeLatest(DELETE_ASSET_TYPE, fetchDeleteAssetType);
  yield takeLatest(UPDATE_ASSET_TYPE, fetchUpdateAssetType);
  // ADD_ORIGIN
  yield takeLatest(GET_ALL_ORIGIN, fetchGetAllOrigin);
  yield takeLatest(ADD_ORIGIN, fetchAddOrigin);
  yield takeLatest(UPDATE_ORIGIN, fetchUpdateOrigin);
  yield takeLatest(DELETE_ORIGIN, fetchDeleteOrigin);
}
