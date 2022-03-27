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
      icon: 'account_circle',
      text: 'Usuarios',
    },
  ];
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    console.log('pasa!!');
  }

  logout = () => {
    /**this.authService.signOut().subscribe(() => {
      //this.router.navigateByUrl('');
      console.log('pasa!');
    });**/
  };

  ngOnInit() {}
}
