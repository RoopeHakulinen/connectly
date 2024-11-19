import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface User {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #http: HttpClient = inject(HttpClient);

  getMe(): Observable<User> {
    return this.#http.get<User>('/api/users/me');
  }
}
