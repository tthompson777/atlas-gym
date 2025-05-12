import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable()
export class FirebaseTokenInterceptor implements HttpInterceptor {
  constructor(private auth: Auth) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return new Observable(subscriber => {
      onAuthStateChanged(this.auth, async user => {
        if (user) {
          const token = await user.getIdToken();
          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          next.handle(cloned).subscribe({
            next: val => subscriber.next(val),
            error: err => subscriber.error(err),
            complete: () => subscriber.complete()
          });
        } else {
          next.handle(req).subscribe({
            next: val => subscriber.next(val),
            error: err => subscriber.error(err),
            complete: () => subscriber.complete()
          });
        }
      });
    });
  }
}
