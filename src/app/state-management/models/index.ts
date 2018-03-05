import { User, AccessGroup, Job, RawDataset } from 'shared/sdk/models';

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
}



export { User, AccessGroup, Job, RawDataset };