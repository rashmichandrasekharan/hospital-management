

import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet,RouterLink],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    currentYear = new Date().getFullYear();
    constructor(private router: Router) { }

    navClick(divId: string): void {
        const navItems = document
            .getElementsByClassName('nav-item');
        for (let i = 0; i < navItems.length; i++) {
            if (navItems[i].id === 'nav-' + divId) {
                navItems[i].className =
                    'nav-item inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active';
            } else {
                navItems[i].className =
                    'nav-item inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300';
            }
        }
        this.router.navigate(['/' + divId]);
    }
}