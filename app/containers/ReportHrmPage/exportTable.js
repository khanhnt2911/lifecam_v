import React, { useEffect, useState } from 'react';
import { API_ORIGANIZATION } from 'config/urlConfig';
import moment from 'moment';
import { Loading } from 'components/LifetekUi';
import { fetchData, serialize } from 'helper';

const formatExportDate = date => {
  if (!date) return '';
  if (moment.isMoment(date)) return date.format('DD/MM/YYYY');
  if (moment(date, 'YYYY-MM-DD').isValid()) return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
  return date.toString();
};
const LIMIT_REPORT_DATA = 500;

const code = 'reportStatsHrm';

function ExportExcel(props) {
  const {
    filter,
    open,
    onClose,
    exportDate,
    startDate,
    endDate,
    department,
    employee,
    maxLimit,
    row,
    col,
    currentPage,
    pageSize,
    titleExcel,
    listTitle,
    listDataSmall,
    dataRevenueRxpend,
  } = props;
  
  // const url = `${props.url}/export`

  // const [departments, setDepartments] = useState();
  // const [dataPageExcell, setDataPageExcell] = useState({
  //   data: [],
  //   totalPage: 1,
  //   pageNumber: 1,
  //   numberOrderFirstPage: 1,
  // });

  // const { data, totalPage, pageNumber, numberOrderFirstPage } = dataPageExcell;

  useEffect(
    () => {
      if (open) {
        
        getDataFirstTime();
      }
    },
    [ open],
  );


  const getDataFirstTime = async () => {
    
    onClose();
  };
  // const getDataPagination = async (skip, limit, totalPage, pageNumber) => {
  //   try {
  //     const newFilter = {
  //       ...filter,
  //       skip,
  //       limit,
  //       modelName: code,
  //       startDate: typeof filter.startDate === 'string' ? filter.startDate : moment(filter.startDate).format('YYYY-MM-DD'),
  //       endDate: typeof filter.endDate === 'string' ? filter.endDate : moment(filter.endDate).format('YYYY-MM-DD'),
  //     };
  //     const query = serialize(newFilter);
  //     const apiUrl = `${url}?${query}`;

  //     const res = await fetchData(apiUrl);
  //     if (!res.data) throw res;
  //     setDataPageExcell({ ...dataPageExcell, data: res.data, totalPage, pageNumber, numberOrderFirstPage: skip + 1 });

  //     onClose({ totalPage, pageNumber });
  //   } catch (err) {
  //     onClose({ error: true });
  //   }
  // };
  return (
    <React.Fragment>
     
        <div id="ExportTable" style={{ display: 'none' }}>
          <table>
            <tbody>
              {/* <tr>
                <td>Ph??ng ban/chi nh??nh:</td>
               
              </tr>
              <br />
              <tr>
                <td>Nh??n vi??n:</td>
                <td>{employee && employee.name}</td>
              </tr>
              <br />
              <tr>
                <td>Ng??y th??ng:</td>
                <td>
                  {`${formatExportDate(startDate)}`}-{`${formatExportDate(endDate)}`}
                </td>
              </tr>
              <br /> */}
              <tr>
                <td>Ng??y xu???t b??o c??o:</td>
                <td>{`${formatExportDate(exportDate)}`}</td>
              </tr>
            </tbody>
          </table>
          <br />
          <table>
            <thead>
              <tr style={{ background: '#959a95' }}>
                <th>STT</th>
                <th>T??NH TR???NG</th>
                <th>S??? L?????NG</th>
                {/* <th>T??nh tr???ng</th> */}
                {/* <th>???nh ?????i di???n</th> */}
                {/* <th>Ch???c v???</th> */}
                {/* <th>Th??? th??ch</th>
                <th>Th?????ng kinh doanh</th>
                <th>D???ng d???i ng??n</th>
                <th>Vi ph???m</th>
                <th>Ngh??? kh??ng l????ng</th> */}
              </tr>
            </thead>
            <tbody>
              {row &&
              Array.isArray(row) &&
              row.length > 0 &&
              row.map((item, index) => (

                <tr>
                 
                  <td style={{textAlign: 'center'}}>{index + 1}</td>
                  {/* <td>{item.code}</td>
                  <td>{item.employeeId && item.employeeId.username}</td> */}
                  <td >{item.name}</td>
                  <td style={{textAlign: 'center'}}>{item.value}</td>
                  {/* <td>{item.employeeId && item.employeeId.phoneNumber}</td>
                  <td>{item.organizationUnit && item.organizationUnit.name}</td>
                  <td>{item.organizationUnit && item.organizationUnit.name}</td> */}
                  {/* <td>{item.employeeId && item.employeeId.typeEmp}</td> */}
                  {/* <td>{item.employeeId && item.employeeId.avatar}</td> */}
                  {/* <td>{item.employeeId && item.employeeId.positions}</td> */}
                  {/* <td>{item.employeeId && item.employeeId.challengeInformation}</td>
                  <td>{item.employeeId && item.employeeId.businessBonus}</td>
                  <td>{item.employeeId && item.employeeId.disbursementPause}</td>
                  <td>{item.employeeId && item.employeeId.violate}</td>
                  <td>{item.employeeId && item.employeeId.vacation}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      
    </React.Fragment>
  );
}

export default ExportExcel;
