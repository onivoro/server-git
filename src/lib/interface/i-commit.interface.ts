import { IAuthor } from './i-author.interface';

export interface ICommit {
  hash: string;
  refs: string[];
  author: IAuthor;
  message: string;
}