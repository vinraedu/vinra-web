import { HelperService } from './../helperservice.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [
		'./login.component.css'
	]
})
export class LoginComponent implements OnInit {
	registerForm: FormGroup = new FormGroup({});
	loading = false;
	invalidLogin = false;
	submitted = false;
	email = '';
	password = '';

	onSubmit() {
		this.submitted = true;
		if (this.registerForm.invalid) {
			return;
		}
		this.loading = true;
		this.email = this.registerForm.value.email;
		this.password = this.registerForm.value.password;

		if (this.helperService.login(this.email, this.password)) {
			this.router.navigate([
				'cms/dashboard'
			]);
			this.loading = false;
		} else {
			this.invalidLogin = true;
			this.loading = false;
		}
	}

	constructor(
		private router: Router,
		private formBuilder: FormBuilder,
		private helperService: HelperService
	) {}

	ngOnInit() {
		this.registerForm = this.formBuilder.group({
			email: [
				'',
				Validators.required
			],
			password: [
				'',
				[
					Validators.required,
					Validators.minLength(4)
				]
			]
		});

		if (localStorage.getItem('currentUser')) {
			this.router.navigate([
				'cms/dashboard'
			]);
			this.loading = false;
		}
	}
}
