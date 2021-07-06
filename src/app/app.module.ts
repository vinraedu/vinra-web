import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AppComponent } from './app.component';
import { environment } from './../environments/environment';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentsComponent } from './students/students.component';
import { BooksComponent } from './books/books.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NotificationComponent } from './notification/notification.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CoursesComponent } from './courses/courses.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const appRoutes: Routes = [
	{ path: 'cms', component: LoginComponent },
	{ path: 'cms/dashboard', component: DashboardComponent },
	{ path: 'cms/courses', component: CoursesComponent },
	{ path: 'cms/students', component: StudentsComponent },
	{ path: 'cms/books', component: BooksComponent },
	{ path: 'cms/notifications', component: NotificationComponent },
    { path: "", redirectTo:"cms", pathMatch: 'full'}
];

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		DashboardComponent,
		StudentsComponent,
		BooksComponent,
		HeaderComponent,
		SidebarComponent,
		NotificationComponent,
		CoursesComponent
	],
	imports: [
		RouterModule.forRoot(appRoutes),
		BrowserModule,
		FormsModule,
        SweetAlert2Module.forRoot(),
		BsDatepickerModule.forRoot(),
		ReactiveFormsModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		BsDatepickerModule.forRoot(),
		BrowserAnimationsModule
	],
	providers: [],
	bootstrap: [
		AppComponent
	]
})
export class AppModule {}
