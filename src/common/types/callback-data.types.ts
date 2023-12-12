import { SELECTION_TYPE } from '../constants';
import { ObjectValues } from './general.types';

export type CallbackData<T> = {
  data: T;
  type: ObjectValues<typeof SELECTION_TYPE>;
};
