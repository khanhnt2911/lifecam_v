/* eslint-disable no-alert */
/* eslint-disable react/no-unused-state */
import React from 'react';
import SortableTree, { toggleExpandedForAll, changeNodeAtPath, removeNodeAtPath, getFlatDataFromTree } from 'react-sortable-tree';
import { Edit, Delete } from '@material-ui/icons';

import { Button, withStyles, Typography, MenuItem, Checkbox } from '@material-ui/core';
import { AsyncAutocomplete } from 'components/LifetekUi';
import TextField from './LtTextField';
import Grid from './LtGrid';
import Dialog from './Dialog';
import GridMUI from '@material-ui/core/Grid';

import './tree.css';
// import messages from '../../containers/AddSampleProcess/messages';
import { generateId, findListDep, fetchData } from '../../helper';
import 'react-sortable-tree/style.css';
import { clientId } from '../../variable';
import { API_USERS, API_TEMPLATE, API_APPROVE_GROUPS } from '../../config/urlConfig';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
    flexBasis: 200,
  },
});

const maxDepth = 5;

const getNodeKey = ({ treeIndex }) => treeIndex;

const mapFunction = item => ({ name: item.name, id: item._id });

class Treeview extends React.Component {
  state = {
    treeData: [],
    open: false,
    name: '',
    duration: 0,
    node: {},
    join: [],
    inCharge: [],
    approved: [],
    employees: [],
    // eslint-disable-next-line react/no-unused-state
    treeIndex: 0,
    subtitle: '',
    templateId: null,
    modules: JSON.parse(localStorage.getItem('crmStatus')),
    md: '',
    listMd: [],
    moduleStatus: '',
    category: 1,
    durationUnit: 'day',
    list: [],
    path: [],
    dependent: '',
    isRoot: false,
    idTree: '',
    isApproved: false,
    isObligatory: false,
    listTemplates: [],
    template: null,
  };

  loadData = async () => {
    const data = await Promise.all([fetchData(`${API_TEMPLATE}?clientId=${clientId}`)]);
    const newData = data[0].filter(i => i.moduleCode === 'Task').map(i => ({ name: i.title, id: i._id }));
    this.setState({ listTemplates: newData });
  };

  componentDidMount() {
    this.loadData();
  }

  getNodeInfo = ({ node, path, treeIndex }) => {
    // console.log(node,'nodeeee')
    const totalNode = getFlatDataFromTree({ treeData: this.state.treeData, getNodeKey: ({ treeIndex }) => treeIndex });
    // console.log('TAOTAL', totalNode);

    const mapNode = totalNode.map((item, index) => ({ name: item.node.title, disabled: path.includes(index), idTree: item.node.idTree }));
    // console.log('MAPNODE', mapNode);
    // function checkPath(currentPath, ItemPath, index) {
    //   let x = true;
    //   currentPath.forEach((it, id) => {
    //     it !== ItemPath[id];
    //     x = false;
    //   });
    // }
    // eslint-disable-next-line react/no-unused-state
    const join = [...node.join];
    const inCharge = [...node.inCharge];
    const approved = [...node.approved];

    this.setState({
      open: true,
      name: node.title,
      duration: node.duration,
      durationUnit: node.durationUnit || 'day',
      // subtitle: node.subtitle,
      category: node.category,
      path,
      node,
      treeIndex,
      join: join.map(i => ({ _id: i.id, name: i.name})),
      inCharge: inCharge.map(i => ({ _id: i.id, name: i.name})),
      description: node.description,
      idTree: node.idTree,
      approved,
      dependent: node.dependent,
      link: node.link,
      moduleStatus: node.moduleStatus,
      list: mapNode,
      isApproved: node.isApproved,
      isObligatory: node.isObligatory,
      template: node.template,
    });
  };

  handleTreeOnChange = treeData => {
    // alert('gfdg)');
    this.setState({ treeData });
  };

  static getDerivedStateFromProps(props, state) {
    if (props.templateId !== state.templateId)
      return {
        treeData: props.treeData,
        templateId: props.templateId,
      };
    return null;
  }

  saveNode = () => {
    // alert('cv');
    const {
      treeData,
      path,
      node,
      name,
      description,
      duration,
      join,
      inCharge,
      approved,
      category,
      link,
      moduleStatus,
      dependent,
      idTree,
      isApproved,
      isObligatory,
      template,
      durationUnit,
    } = this.state;
    const totalNode = getFlatDataFromTree({ treeData, getNodeKey: ({ treeIndex }) => treeIndex });
    const mapNode = totalNode.map((item, index) => ({
      name: item.node.title,
      disabled: path.includes(index),
      idTree: item.node.idTree,
      dependent: item.node.dependent,
    }));
    const a = [];

    findListDep(dependent, mapNode, a);
    // console.log('A', a);
    const check = a.includes(idTree);
    if (check) {
      alert('Kh??ng th??? ch???n c??ng vi???c n??y v?? s??? g??y v??ng l???p v?? h???n');
      return;
    }
    const tieude = mapNode.find(i => i.idTree === dependent);
    const sub = tieude ? ` Ph??? thu???c:${tieude.name}` : '';
    const newJoin = [...join];
    const newInCharge = [...inCharge];
    const newApproved = [...approved];
    const newTree = changeNodeAtPath({
      treeData,
      path,
      getNodeKey,
      newNode: {
        ...node,
        title: name,
        subtitle: sub,
        duration,
        durationUnit,
        join: newJoin.map(i => ({ id: i._id, name: i.name})),
        inCharge: newInCharge.map(i => ({ id: i._id, name: i.name})),
        approved: newApproved,
        category,
        link,
        description,
        moduleStatus,
        dependent,
        idTree,
        isApproved,
        isObligatory,
        template,
      },
    });
    this.setState({
      treeData: newTree,
      open: false,
    });
  };

  toggleNodeExpansion = expanded => {
    this.setState(prevState => ({
      treeData: toggleExpandedForAll({
        treeData: prevState.treeData,
        expanded,
      }),
    }));
  };

  handleChange = name => e => {
    let value;
    if (name === 'duration') {
      value = parseInt(e.target.value);
    } else {
      value = e.target.value;
    }
    this.setState({ [name]: value });
  };

  addNewTask = () => {
    const treeData = this.state.treeData;
    const newTree = [
      {
        title: 'C??ng vi???c m???i',
        description: '',
        duration: 1,
        expanded: true,
        join: [],
        inCharge: [],
        approved: [],
        moduleStatus: '',
        link: '',
        idTree: generateId(),
        dependent: '',
        isApproved: false,
        isObligatory: false,
        durationUnit: 'day',
      },
    ].concat(treeData);
    this.setState({ treeData: newTree });
  };

  render() {
    const { treeData, isApproved, template, listTemplates, isObligatory } = this.state;
    return (
      <Grid container>
        <Grid style={{ display: 'flex' }} item md={6}>
          <Button color="primary" variant="outlined" onClick={this.addNewTask}>
            Th??m m???i c??ng vi???c
          </Button>
          {/* <Button onClick={() => this.props.onSave(treeData)} color="primary" variant="outlined">
            L??u L???i
          </Button> */}
          <button
            type="button"
            ref={this.props.saveRef}
            onClick={() => {
              this.props.onSave(treeData);
            }}
            hidden
          />
        </Grid>
        <Grid style={{ display: 'flex' }} item md={6}>
          <Button color="primary" variant="outlined" onClick={() => this.toggleNodeExpansion(true)}>
            M??? r???ng t???t c???
          </Button>
          <Button color="primary" variant="outlined" onClick={() => this.toggleNodeExpansion(false)}>
            Thu g???n t???t c???
          </Button>
        </Grid>
        <Grid item md={2} />
        <Grid style={{ height: window.innerHeight, textAlign: 'center' }} item md={9}>
          <SortableTree
            treeData={treeData}
            onChange={this.handleTreeOnChange}
            onMoveNode={({ node, treeIndex, path }) => global.console.debug('node:', node, 'treeIndex:', treeIndex, 'path:', path)}
            // maxDepth={maxDepth}
            fullWidth
            canDrag={({ node }) => !node.noDragging}
            canDrop={({ nextParent }) => !nextParent || !nextParent.noChildren}
            isVirtualized
            generateNodeProps={rowInfo => ({
              title: <Typography variant="body1">{rowInfo.node.title}</Typography>,
              buttons: [
                <Edit style={{ cursor: 'pointer' }} onClick={() => this.getNodeInfo(rowInfo)} />,
                <Delete
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    this.setState(state => ({
                      treeData: removeNodeAtPath({
                        treeData: state.treeData,
                        path: rowInfo.path,
                        getNodeKey,
                      }),
                    }))
                  }
                />,
              ],
            })}
          />
        </Grid>
        <Grid item md={1} />
        <Dialog
          onSave={this.saveNode}
          onCancel={() => this.setState({ open: false })}
          title="S???a c??ng vi???c"
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
        >
          <TextField onChange={this.handleChange('name')} value={this.state.name} label="T??n c??ng vi???c" />
          <GridMUI container spacing={2}>
            <GridMUI item xs={10}>
              <TextField fullWidth onChange={this.handleChange('duration')} value={this.state.duration} type="number" label="Th???i l?????ng" />
            </GridMUI>
            <GridMUI item xs={2}>
              <TextField
                fullWidth
                onChange={e => this.setState({ durationUnit: e.target.value })}
                select
                value={this.state.durationUnit}
                label="????n v???"
              >
                <MenuItem key="day" value="day">
                  Ng??y
                </MenuItem>
                <MenuItem key="hour" value="hour">
                  Gi???
                </MenuItem>
              </TextField>
            </GridMUI>
          </GridMUI>
          <TextField onChange={e => this.setState({ dependent: e.target.value })} select value={this.state.dependent} InputLabelProps={{ shrink: true }} label="B???t ?????u sau c??ng vi???c">
            {this.state.list.map(item => (
              <MenuItem key={item.idTree} disabled={item.disabled} value={item.idTree}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField value={this.state.category} onChange={e => this.setState({ category: e.target.value })} InputLabelProps={{ shrink: true }} select label="Lo???i c??ng vi???c">
            {this.props.configs.map((item, index) => (
              <MenuItem key={item.code} value={index + 1}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
          <AsyncAutocomplete
            // optionValue="id"
            url={API_USERS}
            isMulti
            onChange={this.handleAutocomplele('join')}
            value={this.state.join}
            label="Ng?????i tham gia"
            InputLabelProps={{ shrink: true }}
            // mapFunction={mapFunction}
          />
          <AsyncAutocomplete
            // optionValue="id"
            InputLabelProps={{ shrink: true }}
            url={API_USERS}
            isMulti
            onChange={this.handleAutocomplele('inCharge')}
            value={this.state.inCharge}
            label="Ng?????i ph??? tr??ch"
            // mapFunction={mapFunction}
          />
          <AsyncAutocomplete
          InputLabelProps={{ shrink: true }}
            optionValue="id"
            url={API_APPROVE_GROUPS}
            isMulti
            onChange={value => this.setState({ approved: value })}
            value={this.state.approved}
            label="Nh??m ph?? duy???t"
            mapFunction={mapFunction}
          />

          <TextField select onChange={this.handleChangeModules} value={this.state.link} InputLabelProps={{ shrink: true }} label="Ch???n module">
            {this.state.modules.map(item => (
              <MenuItem value={item.code}>{item.title}</MenuItem>
            ))}
          </TextField>
          <TextField select InputLabelProps={{ shrink: true }} onChange={this.handleChange('moduleStatus')} value={this.state.moduleStatus} label="Ch???n Tr???ng th??i">
            {this.state.listMd.map(item => (
              <MenuItem value={item.type}>{item.name}</MenuItem>
            ))}
          </TextField>
          <TextField InputLabelProps={{ shrink: true }} multiline rows={2} onChange={this.handleChange('description')} value={this.state.description} label="M?? t???" />
          <div>
            <Checkbox onChange={e => this.setState({ isApproved: e.target.checked })} color="primary" checked={this.state.isApproved} />
            Ph?? duy???t
            <Checkbox onChange={e => this.setState({ isObligatory: e.target.checked })} color="primary" checked={isObligatory} />
            B???t bu???c
          </div>
          {isApproved ? (
            <TextField label="Ch???n bi???u m???u" onChange={e => this.setState({ template: e.target.value })} select value={template}>
              {listTemplates.map(i => (
                <MenuItem key={i.id} value={i.id}>
                  {i.name}
                </MenuItem>
              ))}
            </TextField>
          ) : null}
        </Dialog>
      </Grid>
    );
  }

  handleAutocomplele = name => value => {
    // console.log('val', value);
    // let newValue;
    // if (value) {
    //   newValue = value;
    // } else newValue = [];
    this.setState({ [name]: value });
  };

  handleChangeModules = e => {
    const { modules } = this.state;
    const listMd = modules.find(item => item.code === e.target.value).data;
    this.setState({ listMd, link: e.target.value, moduleStatus: '' });
  };
}

export default withStyles(styles)(Treeview);

Treeview.defaultProps = {
  treeData: [],
  templateId: null,
};
