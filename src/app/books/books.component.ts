import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../models/book';
import * as firebase from 'firebase';

@Component({
	selector: 'app-books',
	templateUrl: './books.component.html',
	styleUrls: [
		'./books.component.css'
	]
})
export class BooksComponent implements OnInit {
	booksList: Book[] = [];
	selectedBook: Book | null = null;
	addForm: FormGroup;
	editForm: FormGroup;
	assignBook: FormGroup = new FormGroup({});
	uploadProgress: any;

	constructor(private db: AngularFireDatabase, private formBuilder: FormBuilder) {
		this.db.list('/books').valueChanges().subscribe((ref) => {
			this.booksList = (ref.sort(function(a: any, b: any) {
				var nameA = a.title.toLowerCase(),
					nameB = b.title.toLowerCase();
				if (
					nameA < nameB //sort string ascending
				)
					return -1;
				if (nameA > nameB) return 1;
				return 0;
			}) as Book[]);
		});

		this.addForm = this.formBuilder.group({
			title: [
				'',
				Validators.required
			],
			key: [
				'',
				Validators.required
			],
			file: [
				''
			],
			url: [
				''
			]
		});

		this.editForm = this.formBuilder.group({
			title: [
				'',
				Validators.required
			],
			key: [
				'',
				Validators.required
			],
			file: [
				''
			],
			url: [
				''
			]
		});
	}

	addNewBookClick() {
		this.selectedBook = null;
	}

	addBook() {
		if (this.addForm.invalid) {
			return;
		}

		const mBook = new Book();
		mBook.title = this.addForm.value.title;
		mBook.key = this.addForm.value.key.toLocaleUpperCase();
		mBook.url = this.addForm.value.url;
		this.db.object('/books/' + mBook.key).set(mBook);
		this.addForm.reset();
		this.uploadProgress = null;
	}

	updateBook() {
		if (this.editForm.invalid) {
			return;
		}

		const mBook = new Book();
		mBook.title = this.editForm.value.title;
		mBook.key = this.editForm.value.key.toLocaleUpperCase();
		mBook.url = this.editForm.value.url;
		this.db.object('/books/' + mBook.key).set(mBook);
		this.editForm.reset();
		this.selectedBook = null;
		this.uploadProgress = null;
	}

	selectBook(book: Book) {
		this.selectedBook = book;
		this.editForm.controls['title'].setValue(this.selectedBook.title);
		this.editForm.controls['key'].setValue(this.selectedBook.key);
		this.editForm.controls['url'].setValue(this.selectedBook.url);
	}

	deleteBook() {
		this.db.object('/books/' + this.selectedBook?.key).remove();
		this.editForm.reset();
		this.selectedBook = null;
	}

	ngOnInit() {}

	uplodFileToFirebase(ele: any) {
		console.log(ele);
		const file = ele.target.files[0];
		const storageRef = firebase.default.storage().ref();
		const uploadTask = storageRef.child('pdf/' + file.name).put(file);
		uploadTask.on(
			firebase.default.storage.TaskEvent.STATE_CHANGED,
			(snapshot: any) => {
				// upload in progress
				// this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			},
			(error: any) => {
				// upload failed
				console.log(error);
			},
			() => {
				// upload success
				storageRef.child('pdf/' + file.name).getDownloadURL().then((url: any) => {
					this.uploadProgress = {};
					this.addForm.controls['url'].setValue(url);
					if (this.selectedBook) {
						this.editForm.controls['url'].setValue(url);
						this.selectedBook.url = url;
					}
				});
			}
		);
	}
}
