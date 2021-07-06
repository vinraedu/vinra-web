import { Book } from './book';

export class AssignedBooks {
	book: Book = new Book();
	validFrom!: string;
	validTill!: string;
}
