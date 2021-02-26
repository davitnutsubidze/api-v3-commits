import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BranchInterface} from '../interfaces';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  apiUrl = 'https://api.github.com/repos/davitnutsubidze/api-v3-commits';

  constructor(private http: HttpClient) { }

  getAllBranches(): Observable<BranchInterface[]> {
      return this.http.get<BranchInterface[]>(`${this.apiUrl}/branches`);
    }

  getCommits(branch: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/commits?sha=${branch}&page=1&per_page=5`, {observe: 'response'})
      .pipe(
        map(x => {
          return {
            data: x.body,
            links: x.headers.get('link') ? x.headers.get('link').split(',') : []
          };
        })
      );
  }

}
