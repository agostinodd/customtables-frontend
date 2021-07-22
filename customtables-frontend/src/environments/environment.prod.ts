export const environment = {
  production: true,
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
