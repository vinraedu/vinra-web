import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../models/book';

@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styleUrls: [
		'./notification.component.css'
	]
})
export class NotificationComponent implements OnInit {
	notificationList: any;
	selectedBook: Book = new Book;
	addForm: FormGroup;

	constructor(private db: AngularFireDatabase, private formBuilder: FormBuilder) {
		this.db.list('/notifications').valueChanges().subscribe((ref) => {
			this.notificationList = ref.reverse();
		});

		this.addForm = this.formBuilder.group({
			title: [
				'',
				Validators.required
			],
			message: [
				'',
				Validators.required
			],
			url: [
				''
			],
			email: [
				''
			]
		});
	}

	addNotification() {
		if (this.addForm.invalid) {
			return;
		}

		var mNotification = {
			title: this.addForm.value.title,
			message: this.addForm.value.message,
			email: this.addForm.value.email,
			url: this.addForm.value.url
		};
		this.db.list('/notifications').push(mNotification);
		this.addForm.reset();
	}

	ngOnInit() {}
}
