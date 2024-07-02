import { FindPayloadType } from "./types";
import * as crypto from 'crypto';


export const getFindQueryProps = (payload: FindPayloadType<any>) => {
    const {
      filter = {},
      options = {},
      ref = [],
      sort = {},
      where = {},
    } = payload;
  
    return { filter, options, ref, sort, where };
  };

export const encryptPassword = (password: string) => {
  return crypto.createHmac('sha256', password).digest('hex');
};