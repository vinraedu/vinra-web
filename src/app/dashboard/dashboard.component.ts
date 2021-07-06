import { Course } from './../models/course';
import { Student } from './../models/student';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Book } from '../models/book';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  studentList: Student[] = [];
  booksList: Book[] = [];
  notificationList = [];
  courseList: Course[] = [];

  constructor(private db: AngularFireDatabase) {
    this.db.list('/users').valueChanges().subscribe(ref => {
      this.studentList = ref as Student[];
    });

    this.db.list('/books').valueChanges().subscribe(ref => {
      this.booksList = ref as Book[];
    });

    this.db.list('/notifications').valueChanges().subscribe(ref => {
      this.notificationList = ref as [];
    });

    this.db.list('/course').valueChanges().subscribe(ref => {
      this.courseList = ref as Course[];
    });
  }

  ngOnInit() {
  }

}
