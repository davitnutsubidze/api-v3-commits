import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {BranchInterface} from '../interfaces';
import {groupBy, map, mergeMap, toArray} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  apiUrl = 'https://api.github.com/repos/davitnutsubidze/api-v3-commits';

  constructor(private http: HttpClient) { }

  getAllBranches(): Observable<BranchInterface[]> {
      return this.http.get<BranchInterface[]>(`${this.apiUrl}/branches`);
    }

  getCommits(branch: string, customUrl: string): Observable<any> {
    const url = customUrl ? customUrl : `${this.apiUrl}/commits?sha=${branch}&page=1&per_page=4`;
    return this.http.get(url, {observe: 'response'})
      .pipe(
        map(x => {
          const commits = Object.entries(x.body).map((t) => {
            t[1].commit.committerLogin = t[1].committer.login;
            t[1].commit.committerAvatar = t[1].committer.avatar_url;
            return t[1].commit;
          });
          return {
            data: commits,
            links: x.headers.get('link') ? x.headers.get('link').split(',') : []
          };
        })
      );
  }

}
