import { Course } from './../models/course';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from '../models/student';
import { AssignedBooks } from '../models/assigned-books';
import { Book } from '../models/book';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
	selector: 'app-students',
	templateUrl: './students.component.html',
	styleUrls: [
		'./students.component.css'
	]
})
export class StudentsComponent implements OnInit {
	assignNewBook = false;
	studentList: Student[] = [];
	booksList: Book[] | null = [];
	courseList: Course[] = [];
	selectedStudent: Student | null = new Student;
	addForm: FormGroup;
	editForm: FormGroup;
	assignBook: FormGroup;
	allStudentEmails: any = [];
	emails: any;

	options: BsDatepickerConfig;

	constructor(private db: AngularFireDatabase, private formBuilder: FormBuilder) {
		this.options = new BsDatepickerConfig();
		this.options.dateInputFormat = 'YYYY/MM/DD';

		this.db.list('/users').valueChanges().subscribe((ref) => {
			this.studentList = (ref.sort(function(a: any, b: any) {
				var nameA = a.name.toLowerCase(),
					nameB = b.name.toLowerCase();

				if (nameA < nameB) return -1;
				if (nameA > nameB) return 1;
				return 0;
			}) as Student[]);

			this.studentList.filter((student: Student) => {
				this.allStudentEmails.push(student.email);
				return true;
			});
			this.emails = this.allStudentEmails.toString();
		});

		this.db.list('/course').valueChanges().subscribe((ref) => {
			this.courseList = ref as Course[];
		});

		this.addForm = this.formBuilder.group({
			name: [
				'',
				Validators.required
			],
			email: [
				'',
				[
					Validators.required,
					Validators.email
				]
			],
			phone: [
				'',
				[
					Validators.required,
					Validators.maxLength(10)
				]
			],
			course: [
				Validators.required
			]
		});

		this.editForm = this.formBuilder.group({
			name: [
				'',
				Validators.required
			],
			email: [
				'',
				[
					Validators.required,
					Validators.email
				]
			],
			phone: [
				'',
				[
					Validators.required,
					Validators.maxLength(10)
				]
			],
			course: [
				Validators.required
			]
		});

		this.assignBook = this.formBuilder.group({
			book: [
				'',
				Validators.required
			],
			validFrom: [
				'',
				Validators.required
			],
			validTill: [
				'',
				Validators.required
			]
		});
	}

	addStudent() {
		if (this.addForm.invalid) {
			return;
		}

		const mStudent = new Student();
		mStudent.name = this.addForm.value.name;
		mStudent.email = this.addForm.value.email.toString().replace(' ', '');
		mStudent.phone = this.addForm.value.phone.toString().replace(' ', '');
		mStudent.course = this.addForm.value.course;
		this.db.object('/users/' + mStudent.phone).set(mStudent);
		this.addForm.reset();
	}

	selectStudent(student: Student) {
		this.selectedStudent = student;
		this.editForm.controls['name'].setValue(this.selectedStudent.name);
		this.editForm.controls['email'].setValue(this.selectedStudent.email);
		this.editForm.controls['phone'].setValue(this.selectedStudent.phone);
		this.editForm.controls['course'].setValue(this.selectedStudent.course);
		this.db.object('/course/' + this.selectedStudent.course).valueChanges().subscribe((ref: any) => {
			if (ref.assignedBooks !== undefined) {
				this.booksList = ref.assignedBooks;
			} else {
				this.booksList = null;
			}
		});
		this.assignNewBook = false;
	}

	assignBookToStudent() {
		if (this.assignBook.invalid) {
			return;
		}

		const bookDetails = this.findObjectByKey(this.booksList, 'key', this.assignBook.value.book);
		const mAssignedBook = new AssignedBooks();

		const mBook = new Book();
		mBook.title = bookDetails.title;
		mBook.semester = bookDetails.semester;
		mBook.key = bookDetails.key;
		mBook.url = bookDetails.url;
		mAssignedBook.book = mBook;
		mAssignedBook.validFrom = this.formatDate(this.assignBook.value.validFrom);
		mAssignedBook.validTill = this.formatDate(this.assignBook.value.validTill);
		const index = this.selectedStudent?.assignedBooks !== undefined ? this.selectedStudent.assignedBooks.length : 0;
		this.db.object('/users/' + this.selectedStudent?.phone + '/assignedBooks/' + index).set(mAssignedBook);
		this.assignBook.reset();
		this.selectedStudent = null;
	}

	findObjectByKey(array: any, key: string, value: any) {
		for (let i = 0; i < array.length; i++) {
			if (array[i][key] === value) {
				return array[i];
			}
		}
		return null;
	}

	formatDate(date: string | number | Date) {
		let d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) {
			month = '0' + month;
		}
		if (day.length < 2) {
			day = '0' + day;
		}

		return [
			year,
			month,
			day
		].join('/');
	}

	deleteStudent() {
		this.db.object('/users/' + this.selectedStudent?.phone).remove();
		this.editForm.reset();
		this.selectedStudent = null;
	}

	deleteAssignedBook(index: number) {
		this.selectedStudent?.assignedBooks.splice(index, 1);
		this.db
			.object('/users/' + this.selectedStudent?.phone + '/assignedBooks')
			.set(this.selectedStudent?.assignedBooks);
		this.editForm.reset();
		this.selectedStudent = null;
	}

	cancelDelete() {}

	updateStudent() {
		if (this.editForm.invalid) {
			return;
		}
		this.db.object('/users/' + this.selectedStudent?.phone + '/name').set(this.editForm.value.name);
		this.db
			.object('/users/' + this.selectedStudent?.phone + '/email')
			.set(this.editForm.value.email.toString().replace(' ', ''));
		this.db
			.object('/users/' + this.selectedStudent?.phone + '/phone')
			.set(this.editForm.value.phone.toString().replace(' ', ''));
		this.db.object('/users/' + this.selectedStudent?.phone + '/course').set(this.editForm.value.course);
		if (this.selectedStudent?.course !== this.editForm.value.course) {
			this.db.object('/users/' + this.selectedStudent?.phone + '/assignedBooks').set([]);
		}
		this.editForm.reset();
		this.selectedStudent = null;
	}

	ngOnInit() {}
}
