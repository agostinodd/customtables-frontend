import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {OAuthService} from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class BaseDataGuard implements CanActivate {
  constructor(private oauthService: OAuthService, private router: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const result = await this.credentials().then(() => {
      const hasIdToken = this.oauthService.hasValidIdToken();
      const hasAccessToken = this.oauthService.hasValidAccessToken();
      console.log(hasIdToken && hasAccessToken);
      return (hasIdToken && hasAccessToken);
    });

    if (result) {
      return true;
    } else {
      await this.router.navigate(['/']);
      return false;
    }


  }

  credentials(): Promise<boolean> {
    return this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }
}
