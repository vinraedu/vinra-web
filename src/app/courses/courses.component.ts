import { Component, OnInit } from '@angular/core';
import { Student } from '../models/student';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AngularFireDatabase } from '@angular/fire/database';
import { AssignedBooks } from '../models/assigned-books';
import { Book } from '../models/book';
import { Course } from '../models/course';
import { CourseBook } from '../models/course-books';

@Component({
	selector: 'app-courses',
	templateUrl: './courses.component.html',
	styleUrls: [
		'./courses.component.css'
	]
})
export class CoursesComponent implements OnInit {
	assignNewBook = false;
	courseList: Course[] = [];
	booksList: Book[] = [];
	selectedCourse: any | null = null;
	addForm: FormGroup;
	editForm: FormGroup;
	assignBook: FormGroup;

	options: BsDatepickerConfig;

	constructor(private db: AngularFireDatabase, private formBuilder: FormBuilder) {
		this.options = new BsDatepickerConfig();
		this.options.dateInputFormat = 'YYYY/MM/DD';

		this.db.list('/course').valueChanges().subscribe((ref) => {
			this.courseList = (ref.sort(function(a: any, b: any) {
				var nameA = a.name.toLowerCase(),
					nameB = b.name.toLowerCase();
				if (
					nameA < nameB //sort string ascending
				)
					return -1;
				if (nameA > nameB) return 1;
				return 0;
			}) as Course[]);
		});

		this.db.list('/books').valueChanges().subscribe((ref) => {
			this.booksList = ref as Book[];
		});

		this.addForm = this.formBuilder.group({
			name: [
				'',
				Validators.required
			],
			key: [
				'',
				[
					Validators.required
				]
			]
		});

		this.editForm = this.formBuilder.group({
			name: [
				'',
				Validators.required
			],
			key: [
				'',
				[
					Validators.required
				]
			]
		});

		this.assignBook = this.formBuilder.group({
			book: [
				'',
				Validators.required
			],
			semester: [
				1,
				Validators.required
			]
		});
	}

	addCourse() {
		if (this.addForm.invalid) {
			return;
		}

		const mCourse = new Course();
		mCourse.name = this.addForm.value.name;
		mCourse.key = this.addForm.value.key;
		this.db.object('/course/' + mCourse.key).set(mCourse);
		this.addForm.reset();
	}

	selectCourse(course: Course) {
		this.selectedCourse = course;
		this.editForm.controls['name'].setValue(this.selectedCourse.name);
		this.editForm.controls['key'].setValue(this.selectedCourse.key);
		this.assignNewBook = false;
	}

	assignBookToCourse() {
		if (this.assignBook.invalid) {
			return;
		}

		const bookDetails = this.findObjectByKey(this.booksList, 'key', this.assignBook.value.book);

		const mBook = new Book();
		mBook.title = bookDetails.title;
		mBook.key = bookDetails.key;
		mBook.semester = this.assignBook.controls['semester'].value;
		mBook.url = bookDetails.url;
		const index = this.selectedCourse?.assignedBooks !== undefined ? this.selectedCourse.assignedBooks.length : 0;
		this.db.object('/course/' + this.selectedCourse?.key + '/assignedBooks/' + index).set(mBook);
		this.assignBook.reset();
		this.selectedCourse = null;
	}

	findObjectByKey(array: any, key:any, value: any) {
		for (let i = 0; i < array.length; i++) {
			if (array[i][key] === value) {
				return array[i];
			}
		}
		return null;
	}

	formatDate(date: any) {
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

	deleteCourse() {
		this.db.object('/course/' + this.selectedCourse?.key).remove();
		this.editForm.reset();
		this.selectedCourse = null;
	}

	deleteAssignedBook(index: number) {
		this.selectedCourse?.assignedBooks.splice(index, 1);
		this.db.object('/course/' + this.selectedCourse?.key + '/assignedBooks').set(this.selectedCourse?.assignedBooks);
		this.editForm.reset();
		this.selectedCourse = null;
	}

	cancelDelete() {}

	updateCourse() {
		if (this.editForm.invalid) {
			return;
		}
		this.db.object('/course/' + this.selectedCourse?.key + '/name').set(this.editForm.value.name);
		this.db.object('/course/' + this.selectedCourse?.key + '/key').set(this.editForm.value.key);
		this.editForm.reset();
		this.selectedCourse = null;
	}

	ngOnInit() {}
}
