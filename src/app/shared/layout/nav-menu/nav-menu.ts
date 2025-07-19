import { Component, ViewEncapsulation } from '@angular/core';
import { NavLink } from '../../inputs/nav-link/nav-link';

@Component({
  selector: 'app-nav-menu',
  imports: [NavLink],
  templateUrl: './nav-menu.html',
  styleUrl: './nav-menu.css',
  encapsulation: ViewEncapsulation.None,
})
export class NavMenu {

}