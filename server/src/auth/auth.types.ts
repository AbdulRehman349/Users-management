import { ProfileDocument } from '../profile/profile.model';

export type CreateToken = Pick<
  ProfileDocument,
  '_id' | 'email' | 'firstName' | 'lastName'
> & {
  expireTime?: string;
};
