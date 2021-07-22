// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  auth: {

    // Url of the Identity Provider
    issuer: 'https://keycloak.procevolution.com/auth/realms/PluginManager',

    // URL of the SPA to redirect the user to after login
    redirectUri: window.location.origin + '/data',
    postLogoutRedirectUri: window.location.origin + '/data',

    silentRefreshRedirectUri: window.location.origin + '/data',
    // The SPA's id. The SPA is registered with this id at the auth-server
    clientId: 'AngularBaseDataFrontend',

    // set the scope for the permissions the client should request
    // The first three are defined by OIDC. The 4th is a usecase-specific one
    scope: 'basedata',
  },
  testEmail: 'testmail@mail.com'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
