import { TypeKeys as apiTypeKeys } from '../../api/auth';

const initialState = {
  username: '',
  password: '',
  error: ''
};

export const TypeKeys = {
  UPDATE_INPUT: 'SIGNUP:UPDATE_INPUT'
};

export const updateInput = (key, value) => ({
  type: TypeKeys.UPDATE_INPUT,
  key,
  value
});

export default (state = initialState, action) => {
  switch (action.type) {
    case TypeKeys.UPDATE_INPUT:
      return {
        ...state,
        [action.key]: action.value
      };
    case apiTypeKeys.CREATE_USER_FAIL:
      return {
        ...state,
        error: action.error
      };
    case apiTypeKeys.CREATE_USER_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
