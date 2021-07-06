import { AssignedBooks } from './assigned-books';
import { Course } from './course';

export class Student {
	name: any;
	phone!: string;
	email: any;
	imei: any;
	course!: Course;
	assignedBooks!: AssignedBooks[];
	availableAssignedBooks!: AssignedBooks[];
}
