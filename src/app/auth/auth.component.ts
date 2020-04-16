import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error: string = null;

    constructor(private authSerivce: AuthService) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid)
            return;
        console.log(form.value);
        const email = form.value.email;
        const password = form.value.password;

        this.isLoading = true;
        if (this.isLoginMode) {

            this.isLoading = false;
        } else {
            this.authSerivce.signup(email, password).subscribe(responseData => {
                console.log(responseData);
                this.isLoading = false;
            }, 
            error => {
                console.log(error);
                this.error = "An Error occured: " + error;
                this.isLoading = false;
            });
        }
        form.reset();
    }
}