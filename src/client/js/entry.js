import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import reducers from './reducers';
import { childAdded } from './actions';
// temporary: doesn't belong here
import { connect } from 'react-redux';
import dateString from '../../common/date-string';
import Firebase from 'firebase';
import { LineChart } from 'react-d3-basic';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware // lets us dispatch() from actions
)(createStore);
const store = createStoreWithMiddleware(reducers);

const date = dateString();
const ref = new Firebase(process.env.FIREBASE_URL);
ref.child(date).orderByKey().on('child_added', snapshot =>
  store.dispatch(childAdded(snapshot.val())));

const Data = ({time, numWait, timeWait, totalNum}) => (
  <tr>
    <td>{new Date(time).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</td>
    <td>{numWait}</td>
    <td>{timeWait}</td>
    <td>{totalNum}</td>
  </tr>
);

const List = ({dataList}) => (
  <div className="container">
  <LineChart
  margins={{left: 100, right: 100, top: 10, bottom: 50}}
  title="title"
  chartSeries={[
    {
      field: 'numWait',
      name: '待ち人数',
      color: '#e91e63',
      style: { 'stroke-width': 2 }
    },
    {
      field: 'timeWait',
      name: '約xx分',
      color: '#f44336',
      style: { 'stroke-width': 2 }
    },
    {
      field: 'totalNum',
      name: '本日xx番まで',
      color: '#2196f3',
      style: { 'stroke-width': 2 }
    }
  ]}
  data={dataList}
  width={1000}
  height={300}
  x={d => new Date(d.time)}
  xScale="time" />
    <table className="table">
      <thead>
        <tr>
          <th>時間</th>
          <th>待ち人数</th>
          <th>約xx分</th>
          <th>本日xx番まで</th>
        </tr>
      </thead>
      <tbody>
        {dataList.map(data => <Data {...data} key={data.time} />)}
      </tbody>
    </table>
  </div>
);

const VisibleList = connect(
  ({ dataList }) => ({ dataList })
)(List);

render((
  <Provider store={store}>
    <VisibleList />
  </Provider>
), document.getElementById('app'))
