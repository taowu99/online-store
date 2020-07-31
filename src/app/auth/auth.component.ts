import { PlaceHolderDirective } from './../shared/placeholder/placeholder.directive';
import { AlertComponent } from './../shared/alert/alert.component';
import { NgForm } from '@angular/forms';
import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer'
import * as AuthActions from './store/auth.action';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    @ViewChild(PlaceHolderDirective, {static: false}) alertHost: PlaceHolderDirective;

    private closeSub: Subscription;
    private storeSub: Subscription;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>
    ) {}

    ngOnDestroy(): void {
        if (this.closeSub)
            this.closeSub.unsubscribe();
        if (this.storeSub)
            this.storeSub.unsubscribe();
    }

    ngOnInit() {
        this.storeSub = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
            if (this.error)
                this.showErrorAlert(this.error);
        });
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid)
            return;
        // console.log(form.value);
        const email = form.value.email;
        const password = form.value.password;

        // this.isLoading = true;
        
        if (this.isLoginMode)
            this.store.dispatch(new AuthActions.LoginStart({email: email, password: password}));
        else
            this.store.dispatch(new AuthActions.SignupStart({email: email, password: password}));
            // this.authSerivce.signup(email, password);

        // let authObs: Observable<AuthResponseData> = 
        //     this.isLoginMode ? 
        //     this.authSerivce.login(email,password) :
        //     this.authSerivce.signup(email, password);
        // authObs.subscribe(() => {
        //     // console.log(responseData);
        //     this.error = "";
        //     this.isLoading = false;
        //     this.router.navigate(['/recipes']);
        // }, 
        // errorRes => {
        //     console.log(errorRes);
        //     this.error = errorRes;
        //     this.showErrorAlert(errorRes)
        //     this.isLoading = false;
        // });
        form.reset();
    }

    onHandleError() {
        // this.error = null;
        this.store.dispatch(new AuthActions.ClearError());
    }

    private showErrorAlert(message: string) {
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();
        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }
}