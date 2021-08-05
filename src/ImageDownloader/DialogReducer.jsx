export const SET_DATA = 'SET_DATA';
export const SET_SELECTION = 'SET_SELECTION';
export const SET_ALL_SELECTION = 'SET_ALL_SELECTION';
export const SET_DOWNLOAD = 'SET_DOWNLOAD';
export const SET_FINISH = 'SET_FINISH';

export const STATUS_WAITING = 'STATUS_WAITING';
export const STATUS_DOWNLOAD = 'STATUS_DOWNLOAD';
export const STATUS_FINISH = 'STATUS_FINISH';

export function reducer(state, action) {
  switch (action.type) {
    case SET_DATA:
      return {
        ...state,
        data: action.value,
      };
    case SET_SELECTION:
      return {
        ...state,
        data: state.data.map((d, i) => ({
          ...d,
          selected: i === action.value ? !d.selected : d.selected,
        })),
      };
    case SET_ALL_SELECTION:
      return {
        ...state,
        data: state.data.map((d) => ({ ...d, selected: action.value })),
      };
    case SET_DOWNLOAD:
      return {
        ...state,
        target: state.data.filter((d) => d.selected),
        status: STATUS_DOWNLOAD,
      };
    case SET_FINISH:
      return {
        data: state.data.map((d) => ({ ...d, selected: false })),
        target: [],
        status: STATUS_FINISH,
      };
    default:
      return state;
  }
}

export const initState = {
  data: [],
  target: [],
  status: 'STATUS_WAITING',
};
