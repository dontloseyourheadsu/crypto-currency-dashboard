import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenu } from "./shared/layout/nav-menu/nav-menu";
import { Mainlayout } from "./shared/layout/mainlayout/mainlayout/mainlayout";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavMenu, Mainlayout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'crypto-currency-dashboard';
}
