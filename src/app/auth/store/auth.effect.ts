import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.action';
import { environment } from '../../../environments/environment'
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../user.model';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate,
        redirect: true
    });
};

const handleError = (errorRes: any) => {
    let errorMessage = "An unknown error occurred!";
    if (!errorRes.error || !errorRes.error.error)
        return of (new AuthActions.AuthenticateFail(errorMessage));
    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = "This email exists already";
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = "Email not found";
            break;
        case 'INVALID_PASSWORD':
            errorMessage = "Password is invalid";
            break;
    }
    return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap( (signupAction: AuthActions.SignupStart) => {
            return this.http
                .post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.firebaseAPIKey,
                    {
                        email: signupAction.payload.email,
                        password: signupAction.payload.password,
                        returnSecureToken: true
                    }
                ).pipe(
                    tap(resData => {
                        this.authService.setAutoLogoutTimer(+resData.expiresIn * 1000)
                    }),
                    map(resData => {
                        return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
                    }),
                    catchError(errorRes => {
                        return handleError(errorRes);
                    })
                )
        })
    );

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap(resData => {
                    this.authService.setAutoLogoutTimer(+resData.expiresIn * 1000)
                }),
                map(resData => {
                    return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
                    // const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
                    // return new AuthActions.AuthenticateSuccess({
                    //     email: resData.email,
                    //     userId: resData.localId,
                    //     token: resData.idToken,
                    //     expirationDate: expirationDate
                    // });
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                    // let errorMessage = "An unknown error occurred!";
                    // if (!errorRes.error || !errorRes.error.error)
                    //     return of (new AuthActions.AuthenticateFail(errorMessage));
                    // switch (errorRes.error.error.message) {
                    //     case 'EMAIL_EXISTS':
                    //         errorMessage = "This email exists already";
                    //         break;
                    //     case 'EMAIL_NOT_FOUND':
                    //         errorMessage = "Email not found";
                    //         break;
                    //     case 'INVALID_PASSWORD':
                    //         errorMessage = "Password is invalid";
                    //         break;
                    // }
                    // return of(new AuthActions.AuthenticateFail(errorMessage));
                })
            );
        }),
    );

    @Effect({dispatch: false})
    authRedirect = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS), tap( 
        (authSuccessAaction: AuthActions.AuthenticateSuccess) => { 
            if (authSuccessAaction.payload.redirect)
                this.router.navigate(['/']); 
        }
    ));

    @Effect({dispatch: false})
    authLogout = this.actions$.pipe(ofType(AuthActions.LOGOUT), tap(
        () => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        }
    ));

    @Effect()
    autoLogin = this.actions$.pipe(ofType(AuthActions.AUTO_LOGIN), map(
        () => {            
            const userData: {
                email: string,
                id: string,
                _token: string,
                _tokenExpirationDate: string
            } = JSON.parse(localStorage.getItem('userData'));
            if (!userData)
            return {type: 'DUMMY'};
            else {
                const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
                if (loadedUser.token) {
                    const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                    this.authService.setAutoLogoutTimer(expirationDuration);
                    // this.user.next(loadedUser);
                    return new AuthActions.AuthenticateSuccess({
                        email: loadedUser.email,
                        userId: loadedUser.id,
                        token: loadedUser.token,
                        expirationDate: new Date(userData._tokenExpirationDate),
                        redirect: true
                    });
                    // this.autoLogout(expirationDuration);  
                }
                return {type: 'DUMMY'};
            }
        }
    ));

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {}
}