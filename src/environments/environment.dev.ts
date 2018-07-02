// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  //lbBaseURL: 'http://127.0.0.1:3000',
  lbBaseURL: 'http://scicat.maxiv.lu.se',
  fileserverBaseURL: 'http://l27.0.0.1:8889',
  archiveWorkflowEnabled: true,
  externalAuthEndpoint: '/auth/msad'
};
