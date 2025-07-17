import { Component } from '@angular/core';
import { NavMenu } from '../../nav-menu/nav-menu';

@Component({
  selector: 'app-mainlayout',
  imports: [NavMenu],
  templateUrl: './mainlayout.html',
  styleUrl: './mainlayout.css',
  standalone: true,
})
export class Mainlayout {

}
