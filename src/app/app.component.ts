import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [
		'./app.component.css'
	]
})
export class AppComponent {
	title = 'Vinra Edu Tab CMS';
	currentUser: string | null = null;

	constructor(private router: Router) {}

	ngOnInit() {
		this.router.events.subscribe((val: any) => {
			var mUrl = val.url;
			var isCMSURL = false;

			if (mUrl != undefined) {
				isCMSURL = mUrl.indexOf('/cms') >= 0 ? true : false;
			}

			switch (true) {
				case isCMSURL:
					this.currentUser = localStorage.getItem('currentUser');
					break;
			}
		});
	}
}
