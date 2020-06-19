import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Observable } from 'rxjs';
import { AuthResponseData } from './auth.service'

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error: string = null;

    constructor(private authSerivce: AuthService, private router: Router) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid)
            return;
        // console.log(form.value);
        const email = form.value.email;
        const password = form.value.password;

        this.isLoading = true;
        
        let authObs: Observable<AuthResponseData> = 
            this.isLoginMode ? this.authSerivce.login(email,password) : this.authSerivce.signup(email, password);
        authObs.subscribe(responseData => {
            // console.log(responseData);
            this.error = "";
            this.isLoading = false;
            this.router.navigate(['/recipes']);
        }, 
        errorRes => {
            console.log(errorRes);
            this.error = errorRes;
            this.isLoading = false;
        });
        form.reset();
    }
}