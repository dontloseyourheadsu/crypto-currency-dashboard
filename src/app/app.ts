import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenu } from "./shared/layout/nav-menu/nav-menu";
import { Mainlayout } from './shared/layout/mainlayout/mainlayout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Mainlayout],
  templateUrl: './app.html',
})
export class App {
  protected title = 'crypto-currency-dashboard';
}
