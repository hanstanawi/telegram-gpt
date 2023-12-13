import { SELECTION_TYPE } from '../constants';
import { ObjectValues } from './general.types';

export type SelectionType = ObjectValues<typeof SELECTION_TYPE>;
export type CallbackData<T> = {
  data: T;
  type: SelectionType;
};
