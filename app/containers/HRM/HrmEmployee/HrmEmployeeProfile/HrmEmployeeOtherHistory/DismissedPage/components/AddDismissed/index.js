/**
 *
 * AddDismissed
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Info } from '@material-ui/icons';
import { Grid, Typography, FileUpload } from '../../../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../../../components/Input/CustomInputBase';
import CustomButton from '../../../../../../../../components/Button/CustomButton';
import CustomGroupInputField from '../../../../../../../../components/Input/CustomGroupInputField';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired } from 'utils/common';
import CustomAppBar from 'components/CustomAppBar';
import Department from '../../../../../../../../components/Filter/DepartmentAndEmployee';
import CustomDatePicker from '../../../../../../../../components/CustomDatePicker';
import moment from 'moment';

/* eslint-disable react/prefer-stateless-function */

const blockInvalidChar = e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();

function AddDismissed(props) {
  const { dismissed, onSave, onClose, code, fileName, hrmEmployeeId, profile } = props;
  const [localState, setLocalState] = useState({
    others: {},
  });
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [name2Title, setName2Title] = useState({});

  useEffect(() => {
    const newName2Title = viewConfigName2Title(code);
    setName2Title(newName2Title);
    const checkRequired = viewConfigCheckRequired(code, 'required');
    setLocalCheckRequired(checkRequired);
    const checkShowForm = viewConfigCheckRequired(code, 'showForm');
    setLocalCheckShowForm(checkShowForm);

    return () => {
      newName2Title;
      checkRequired;
      checkShowForm;
    };
  }, []);

  useEffect(
    () => {
      if (dismissed && dismissed.originItem) {
        setLocalState({ ...dismissed.originItem });
      } else {
        setLocalState({
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [dismissed],
  );

  const handleInputChange = e => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };
  const handleInputChangeDate = (e, fieldName) => {
    const name = fieldName;
    const value = moment(e).format('YYYY-MM-DD');
    setLocalState({ ...localState, [name]: value });
  };
  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );
  const handeChangeDepartment = data => {
    const { department } = data;
    setLocalState({ ...localState, organizationUnit: department });
  };
  return (
    <div style={{ width: 'calc(100vw - 260px)', padding: 20 }}>
      <CustomAppBar title="Th??ng tin ki??m nhi???m" onGoBack={() => props.onClose && props.onClose()} onSubmit={() => onSave(localState)} />
      <Grid style={{ marginTop: 60 }} />

      <Grid container spacing={8}>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.decisionNumber}
            value={localState.decisionNumber}
            type="number"
            name="decisionNumber"
            onChange={handleInputChange}
            onKeyDown={blockInvalidChar}
            checkedShowForm={localCheckShowForm && localCheckShowForm.decisionNumber}
            required={localCheckRequired && localCheckRequired.decisionNumber}
            error={localMessages && localMessages.decisionNumber}
            helperText={localMessages && localMessages.decisionNumber}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.startDate || 'T??? ng??y'}
            value={localState.startDate}
            name="startDate"
            onChange={e => handleInputChangeDate(e, 'startDate')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.startDate}
            required={localCheckRequired && localCheckRequired.startDate}
            error={localMessages && localMessages.startDate}
            helperText={localMessages && localMessages.startDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.endDate || '?????n ng??y'}
            value={localState.endDate}
            name="endDate"
            onChange={e => handleInputChangeDate(e, 'endDate')}
            checkedShowForm={localCheckShowForm && localCheckShowForm.endDate}
            required={localCheckRequired && localCheckRequired.endDate}
            error={localMessages && localMessages.endDate}
            helperText={localMessages && localMessages.endDate}
          />
        </Grid>
        <Grid item xs={4}>
          <Department onChange={handeChangeDepartment} department={localState.organizationUnit} disableEmployee profile={profile} moduleCode="hrm" />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.positionConcur}
            value={localState.positionConcur}
            name="positionConcur"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.positionConcur}
            required={localCheckRequired && localCheckRequired.positionConcur}
            error={localMessages && localMessages.positionConcur}
            helperText={localMessages && localMessages.positionConcur}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.note}
            rows={4}
            value={localState.note}
            name="note"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.note}
            required={localCheckRequired && localCheckRequired.note}
            error={localMessages && localMessages.note}
            helperText={localMessages && localMessages.note}
          />
        </Grid>
        {/* <Grid item xs={4}>
          <CustomInputBase type="file" label={name2Title.file} value={localState.file} name="file"
            // onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.file}
            required={localCheckRequired && localCheckRequired.file}
            error={localMessages && localMessages.file}
            helperText={localMessages && localMessages.file} />
        </Grid> */}
        <Grid item xs={12}>
          {dismissed && <FileUpload name={`${fileName}/Th??ng tin kinh nghi???m ${dismissed._id}`} id={dismissed._id} code={'hrm/' + fileName} />}
        </Grid>
      </Grid>
      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
    </div>
  );
}

AddDismissed.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

export default memo(AddDismissed);
