import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BranchInterface} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  constructor(private http: HttpClient) { }

  getAllBranches(): Observable<BranchInterface[]> {
      return this.http.get<BranchInterface[]>('https://api.github.com/repos/davitnutsubidze/api-v3-commits/branches');
    }

}
