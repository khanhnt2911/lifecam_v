import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import Department from 'components/Filter/DepartmentAndEmployee';
import { viewConfigName2Title, viewConfigCheckRequired, viewConfigCheckForm } from 'utils/common';
import moment from 'moment';
import ListPage from 'components/List';
import { Paper, Typography, Swipe, Grid, FileUpload, AsyncAutocomplete, TextField } from 'components/LifetekUi';
import KanbanStepper from 'components/KanbanStepper';
import { Edit, Person, Info, Add, ShortText, RadioButtonChecked, Image, CheckBox as CheckBoxUI, CropOriginal } from '@material-ui/icons';
import { MenuItem, Button, Checkbox, Avatar, Tooltip, FormControlLabel, FormControl, RadioGroup, Radio, IconButton } from '@material-ui/core';
import { API_USERS, API_RECRUITMENT, API_HUMAN_RESOURCE } from 'config/urlConfig';
import Buttons from 'components/CustomButtons/Button';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import './index.css';
/* eslint-disable react/prefer-stateless-function */
function AddSubject(props) {
  const [localState, setLocalState] = useState({ type: 'text', obligatory: 'true', name: '' });
  const [checked, setChecked] = useState(0);
  const { onSave, onClose, questionData } = props;
  useEffect(
    () => {
      setLocalState({ ...localState, ...questionData });
    },
    [questionData, props.success],
  );
  useEffect(
    () => {
      if (localState.name !== '') {
        setIsRequired(false);
      }
    },
    [localState],
  );

  useEffect(
    () => {
      if (props.success && props.success === true) {
        setLocalState({ type: 'text', obligatory: 'true', name: '' });
      }

      if (props.loadingData && props.loadingData === true) {
        setTimeout(() => {
          setLocalState({ ...localState, ...questionData });
        }, 1);
      }
    },
    [props.success, props.loadingData],
  );

  const [isRequired, setIsRequired] = useState(false);
  const handleInputChange = useCallback(
    e => {
      setLocalState({ ...localState, [e.target.name]: e.target.value });
    },
    [localState],
  );
  const handleOnSave = () => {
    if (localState.name === '') {
      setIsRequired(true);
    } else {
      setIsRequired(false);
    }
    onSave(localState);
  };
  const handleQuestionListChanged = e => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };
  return (
    <Grid container spacing={16}>
      <Grid item md={5} className="CustomText">
        <CustomInputBase
          label="C??u h???i"
          name="name"
          value={localState.name}
          onChange={handleInputChange}
          error={isRequired}
          required
          helperText={isRequired ? 'Tr?????ng C??u h???i l?? b???t bu???c' : ''}
        />
      </Grid>

      {/* <Grid item md={1}>
                <Tooltip title='T???i ???nh' style={{ marginTop: 10, width: '40px', height: '40px' }}>
                    <CropOriginal />
                </Tooltip>
            </Grid> */}

      <Grid item md={5}>
        <TextField
          className="CustomText"
          select
          fullWidth
          name="type"
          value={localState.type}
          onChange={handleInputChange}
          label="H??nh th???c"
          InputLabelProps={{ shrink: true }}
        >
          <MenuItem value={'text'}>
            <ShortText /> Tr??? l???i ng???n
          </MenuItem>
          <MenuItem value={'checkbox'}>
            <CheckBoxUI /> Tr???c nghi???m
          </MenuItem>
          <MenuItem value={'radio'}>
            <RadioButtonChecked /> ????ng - Sai
          </MenuItem>
        </TextField>
      </Grid>
      <Grid item md={2}>
        <TextField
          className="CustomText"
          select
          fullWidth
          name="obligatory"
          value={localState.obligatory}
          onChange={handleInputChange}
          label="B???t bu???c tr??? l???i"
          InputLabelProps={{ shrink: true }}
        >
          <MenuItem value={'true'}> C??</MenuItem>
          <MenuItem value={'false'}> Kh??ng</MenuItem>
        </TextField>
      </Grid>
      {localState.type === 'text' ? (
        <>
          <Grid item md={6}>
            <CustomInputBase className="CustomText" label="V??n b???n tr??? l???i ng???n" name="data" value={localState.data} />
          </Grid>
        </>
      ) : null}
      {localState.type === 'checkbox' ? (
        <>
          <Grid className="text-right" item md={12} alignItems="flex-end">
            <IconButton
              onClick={() => {
                const data = localState.data ? localState.data : [];
                data.push({
                  content: '',
                  checked: false,
                  name: '',
                });
                setLocalState({ ...localState, data });
                setChecked(checked + 1);
              }}
            >
              <Add color="primary" />
            </IconButton>
          </Grid>
          <Grid container>
            <Grid item xs={10}>
              {localState.data &&
                localState.data.map((item, index) => {
                  return (
                    <Grid item xs={12}>
                      <Grid container spacing={4}>
                        <Grid item xs={2}>
                          <Checkbox
                            checked={localState.data[index].checked}
                            onChange={event => {
                              const { data } = localState;
                              data[index].checked = event.target.checked;
                              setLocalState({ ...localState, data });
                            }}
                          />
                        </Grid>
                        <Grid item xs={8} className="px-2">
                          <CustomInputBase
                            label="C??u tr??? l???i"
                            name="content"
                            value={localState.data[index].content}
                            onChange={event => {
                              const { data } = localState;
                              data[index].content = event.target.value;
                              setLocalState({ ...localState, data });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}
            </Grid>
          </Grid>
          {/* // }) */}
        </>
      ) : null}
      {
        console.log(localState, 'localState')
      }
      {localState.type === 'radio' ? (
        <>
          <Grid item md={8}>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="checked"
                name="checked"
                // className={classes.group}
                value={(localState.checked === true || localState.checked === "true") ? "true" : "false"}

                onChange={handleQuestionListChanged}
              >
                <FormControlLabel value={"true"} control={<Radio />} label="????ng" />
                <FormControlLabel value={"false"} control={<Radio />} label="Sai" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </>
      ) : null}
      <Grid container spacing={8} justify="flex-end">
        <Grid item>
          <CustomButton color="primary" onClick={e => handleOnSave(localState)}>
            L??u
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton color="secondary" onClick={onClose}>
            h???y
          </CustomButton>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default memo(AddSubject);
