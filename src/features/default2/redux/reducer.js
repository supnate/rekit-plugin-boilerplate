import initialState from './initialState';

const reducers = [];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    case 'HOME_FETCH_PROJECT_DATA_SUCCESS':
      console.log('fetching: ', action);
    default:
      newState = state;
      break;
  }
  /* istanbul ignore next */
  return reducers.reduce((s, r) => r(s, action), newState);
}
