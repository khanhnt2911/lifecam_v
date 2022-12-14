/**
 *
 * AdvanceFilters
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { compose } from 'redux';
import { Grid, FormControlLabel, Checkbox } from '@material-ui/core';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import CustomRangeSlider from '../../Filter/CustomRangeSlider';
import CustomInputField from '../../Input/CustomInputField';
import DepartmentAndEmployee from '../../Filter/DepartmentAndEmployee';

function AdvanceFilters(props) {
  const { onChange, query: outerQuery } = props;
  const defaultQuery = {
    age: [18, 50],
    ageFilter: false,

    revenue: [0, 100],
    revenueFilter: false,

    lastUsingServiceYear: [0, 5],
    lastUsingServiceYearFilter: false,

    customerType: null,
    provincial: null,
    department: 0,
    employee: null,

    findCustomerWithoutManager: true,
  };

  const [query, setQuery] = useState(defaultQuery);

  useEffect(
    () => {
      setQuery({
        ...defaultQuery,
        ...outerQuery,
      });
    },
    [outerQuery],
  );

  const handleChange = (name, value) => {
    const newQuery = {
      ...query,
      [name]: value,
    };
    setQuery(newQuery);
    if (onChange) {
      onChange(newQuery);
    }
  };

  const handleChangeDepartmentAndEmployee = value => {
    const { employee, department } = value;
    const newQuery = {
      ...query,
      employee,
      department,
    };
    setQuery(newQuery);
    if (onChange) {
      onChange(newQuery);
    }
  };

  const handleChangeFindCustomerWithoutManager = () => {
    const newFindCustomerWithoutManager = !query.findCustomerWithoutManager;
    const newQuery = {
      ...query,
      findCustomerWithoutManager: newFindCustomerWithoutManager,
    };
    if (newFindCustomerWithoutManager) {
      newQuery.employee = null;
      newQuery.department = 0;
    }
    setQuery(newQuery);
    if (onChange) {
      onChange(newQuery);
    }
  };
  return (
    <>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={query.findCustomerWithoutManager} onClick={handleChangeFindCustomerWithoutManager} />}
            label="L???c kh??ch h??ng ch??a c?? ng?????i ph??? tr??ch"
          />
        </Grid>
        {!query.findCustomerWithoutManager ? (
          <Grid item xs={12}>
            <DepartmentAndEmployee department={query.department} employee={query.employee} onChange={handleChangeDepartmentAndEmployee} />
          </Grid>
        ) : null}
        <Grid item xs={6}>
          <CustomInputField
            label="Lo???i kh??ch h??ng"
            type="vl"
            configType="crmSource"
            configCode="S08"
            name="customerType"
            value={query.customerType}
            onChange={e => handleChange(e.target.name, e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputField
            label="Khu v???c ?????a l??"
            type="vl"
            configType="crmSource"
            configCode="S10"
            value={query.provincial}
            name="provincial"
            onChange={e => handleChange(e.target.name, e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputField
            label="Nh??m kh??ch h??ng"
            type="vl"
            configType="crmSource"
            configCode="S07"
            name="group"
            value={query.group}
            onChange={e => handleChange(e.target.name, e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputField
            label="Ph??n c???p kh??ch h??ng"
            type="vl"
            configType="crmSource"
            configCode="pckh"
            value={query.branches}
            name="branches"
            onChange={e => handleChange(e.target.name, e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputField
            label="Ng??nh ngh???"
            type="vl"
            configType="crmSource"
            configCode="S12"
            name="career"
            value={query.career}
            onChange={e => handleChange(e.target.name, e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputField
            label="M???t h??ng kinh doanh"
            type="vl"
            configType="crmSource"
            configCode="S02"
            value={query.productType}
            name="productType"
            onChange={e => handleChange(e.target.name, e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputField
            label="Ngu???n"
            type="vl"
            configType="crmSource"
            configCode="S06"
            name="contactWays"
            value={query.contactWays}
            onChange={e => handleChange(e.target.name, e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputField
            label="H??nh th???c trao ?????i"
            type="vl"
            configType="crmSource"
            configCode="S03"
            value={query.introducedWay}
            name="introducedWay"
            onChange={e => handleChange(e.target.name, e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomRangeSlider
            value={query.age}
            title="????? tu???i"
            unit="tu???i"
            min="0"
            max="100"
            enableFilter={query.ageFilter}
            onEnableFilterChange={value => handleChange('ageFilter', value)}
            onChange={value => {
              handleChange('age', value);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomRangeSlider
            value={query.revenue}
            title="Doanh s???"
            unit="t??? VND"
            min="0"
            max="1000"
            enableFilter={query.revenueFilter}
            onEnableFilterChange={value => handleChange('revenueFilter', value)}
            onChange={value => {
              handleChange('revenue', value);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomRangeSlider
            value={query.lastUsingServiceYear}
            unit="n??m"
            title="Th???i gian s??? dung d???ch v???"
            min="0"
            max="50"
            enableFilter={query.lastUsingServiceYearFilter}
            onEnableFilterChange={value => handleChange('lastUsingServiceYearFilter', value)}
            onChange={value => {
              handleChange('lastUsingServiceYear', value);
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}

AdvanceFilters.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  handleSave: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default compose(
  memo,
  injectIntl,
)(AdvanceFilters);
