import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  readonly user$ = this.userService.user$;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private readonly router: Router
  ) {}

  logout = () => {
    this.authService
      .signOut()
      .pipe(
        tap(() => {
          this.router.navigate(['sign-in']);
        })
      )
      .subscribe();
  };

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }
}
