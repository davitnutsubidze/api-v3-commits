import {Component, OnDestroy, OnInit} from '@angular/core';
import {GithubService} from './services/github.service';
import {Observable, Subject} from 'rxjs';
import {BranchInterface} from './interfaces';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  branches$: Observable<BranchInterface[]>;
  selectedBranch: BranchInterface;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private githubService: GithubService) {
  }

  ngOnInit(): void {
    this.getBranchesAsyncPipe();
  }


  getBranchesAsyncPipe(): void {
    this.branches$ = this.githubService.getAllBranches();
  }

  getCommits(branch: string): void {
    this.githubService.getCommits(branch).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      console.log(res);
    });
  }

  changeBranch(e: string): void {
    if (e) {
      this.getCommits(e);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
