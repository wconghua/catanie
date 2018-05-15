import { User, AccessGroup, Job, Dataset, Proposal } from 'shared/sdk/models';
export { User, AccessGroup, Job, Dataset, Proposal };

export interface Settings {
  tapeCopies: string;
  datasetCount: number;
  jobCount: number;
  darkTheme: false;
};

export enum MessageType {
  Success = 'success',
  Error = 'error',
};

export class Message {
  content: string;
  type: MessageType;
  duration ? = 10000;
};

export interface DatasetFilters {
  text: string;
  ownerGroup: string[];
  type: string;
  creationTime: {'start': Date, 'end': Date};
  creationLocation: string[];
  skip: number;
  initial: boolean;
  keywords: string[];
};

export interface ProposalFilters {
  text: string;
  //ownerGroup: string[];
  title: string;
  //abstract: string;
  creationTime: {'start': Date, 'end': Date};
  //creationLocation: string[];
  skip: number;
  initial: boolean;
  //keywords: string[];
};
