export const config  = {
  archiveable: ['datasetCreated', 'dataserOnDisk', 'datasetRetrieved', 'archivePreparationFailed' ],
  retrieveable: ['datasetOnDiskAndTape', 'datasetOnTape', 'datasetOnArchiveDisk'],
  datasetStatusMessages: {
      datasetCreated: 'Dataset created',
      datasetOndisk: 'Stored on primary disk and on archive disk',
      datasetOnArchiveDisk: 'Stored on primary disk and on archive disk',
      datasetOnDiskAndTape: 'Stored on primary disk and on tape',
      datasetOnTape: 'Stored only in archive',
      datasetRetrieved: 'Retrieved to target disk',
      datasetDeleted: 'Deleted from archive and disk'
  }
};
