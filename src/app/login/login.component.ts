import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, RequiredValidator, ValidatorFn, Validators } from '@angular/forms';
import { LoginDto, RegisterDto } from '../models/user';
import { Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private navigationService: NavigationService
  ) { }

  registerMode: boolean = false;
  loggedIn: boolean = false


  username = new FormControl('', [Validators.required, Validators.minLength(6)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&\.])[A-Za-z\d$@$!%*?&\.].{7,}')]);
  confirm_password = new FormControl('');
  privacy = new FormControl(false, [Validators.requiredTrue]);

  formReg = new FormGroup({
    username: this.username,
    email: this.email,
    password: this.password,
    confirm_password: this.confirm_password,
    privacy: this.privacy
  });

  formLogIn = new FormGroup({
    email: this.email,
    password: this.password,
  })

  allErrors: string[] = []

  ngOnInit(): void {
    this.loggedIn = this.authService.loggedIn
  }

  login() {
    this.allErrors = [];

    if (this.formLogIn.valid) {

      let user = new LoginDto(
        this.formLogIn.value.email!,
        this.formLogIn.value.password!
      )

      this.authService.login(user).subscribe({
        next: (res) => {
          this.authService.setLoggedIn(res);
          this.navigationService.back()
        },
        error: (err) => {
          this.allErrors.push(err.error);
          this.authService.setLogOut();
        }
      })

    } else {
      if (this.email.hasError("required")) {
        this.allErrors.push("Insert Email")
      } else if (this.email.hasError("email")) {
        this.allErrors.push("Invalid Email")
      }

      if (this.password.hasError("required")) {
        this.allErrors.push("Insert Password")
      } else if (this.password.hasError("minlenght") || this.password.hasError("pattern")) {
        this.allErrors.push("Invalid Password")
      }
    }
  }

  register() {
    this.allErrors = [];

    if (this.password.value != this.confirm_password.value) {
      this.confirm_password.setErrors({ "incorrect": true })
    }


    if (this.formReg.valid) {

      let user = new RegisterDto(
        this.formReg.value.username!,
        this.formReg.value.email!,
        this.formReg.value.password!
      )

      this.authService.register(user).subscribe({
        next: (res) => {
          this.authService.setLoggedIn(res);
          this.navigationService.back();
        },
        error: (err) => {
          this.allErrors.push(err.error);
          this.authService.setLogOut();
        }
      })
      console.log(this.formReg.value)
    } else {
      if (this.username.hasError("required")) {
        this.allErrors.push("Insert Username")
      } else if (this.username.hasError("minlength")) {
        this.allErrors.push("Invalid Username")
      }

      if (this.email.hasError("required")) {
        this.allErrors.push("Insert Email")
      } else if (this.email.hasError("email")) {
        this.allErrors.push("Invalid Email")
      }

      if (this.password.hasError("required")) {
        this.allErrors.push("Insert Password")
      } else if (this.password.hasError("minlenght") || this.password.hasError("pattern")) {
        this.allErrors.push("Invalid Password")
      }

      if (this.confirm_password.hasError("required")) {
        this.allErrors.push("Confirm Password")
      } else if (this.confirm_password.hasError("incorrect")) {
        this.allErrors.push("Incorrect Password")
      }

      if (this.privacy.hasError("required")) {
        this.allErrors.push("Please confirm privacy policy")
      }
    }
  }

  logout(confirm: boolean) {
    if (confirm == true) {
      this.authService.setLogOut();
      this.loggedIn = false;
    } else {
      this.navigationService.back()
    }

  }

  enterRegisterMode() {
    this.allErrors = [];

    this.username.reset();
    this.email.reset();
    this.password.reset();
    this.confirm_password.reset();
    this.privacy.reset();

    this.registerMode = true
  }

  exitRegisterMode() {
    this.allErrors = [];

    this.email.reset();
    this.password.reset();

    this.registerMode = false
  }

}
