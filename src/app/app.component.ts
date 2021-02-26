import {Component, OnDestroy, OnInit} from '@angular/core';
import {GithubService} from './services/github.service';
import {Observable} from 'rxjs';
import {BranchInterface} from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  branches$: Observable<BranchInterface[]>;

  constructor(private githubService: GithubService) {
  }

  ngOnInit(): void {
    this.getBranchesAsyncPipe();
  }


  public getBranchesAsyncPipe(): void {
    this.branches$ = this.githubService.getAllBranches();
  }

  ngOnDestroy(): void {
  }
}
