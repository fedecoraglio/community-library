import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  roles: any[];
  roleSelectedId: number;
  navigations: any[] = [
    {
      order: 1,
      link: 'people',
      icon: 'supervised_user_circle',
      text: 'Usuarios',
    },
    {
      order: 2,
      link: 'members',
      icon: 'account_circle',
      text: 'Socios',
    },
  ];
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  logout = () => {
    /**this.authService.signOut().subscribe(() => {
      //this.router.navigateByUrl('');
      console.log('pasa!');
    });**/
  };

  ngOnInit() {}
}
