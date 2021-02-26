import {Component, OnDestroy, OnInit} from '@angular/core';
import {GithubService} from './services/github.service';
import {from, Observable, Subject} from 'rxjs';
import {BranchInterface, CommitInterface} from './interfaces';
import {groupBy, mergeMap, takeUntil, toArray} from 'rxjs/operators';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  branches$: Observable<BranchInterface[]>;
  selectedBranch: BranchInterface;
  commits = [];

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private githubService: GithubService,
              private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.getBranchesAsyncPipe();
  }


  getBranchesAsyncPipe(): void {
    this.branches$ = this.githubService.getAllBranches();
  }

  getCommits(branch: string): void {
    this.githubService.getCommits(branch).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.setCommits(res.data);
    });
  }

  setCommits(commits): void {
    const source = from(commits);
    const groupObs = source.pipe(
      groupBy((item: CommitInterface) => this.datePipe.transform(item.committer.date, 'yyyy-MM-dd')),
      mergeMap(group => group.pipe(toArray()))
    );
    groupObs.pipe(takeUntil(this.destroy$)).subscribe(val => this.commits.push(val));
    console.log(this.commits);
  }

  changeBranch(e: string): void {
    this.commits = [];
    if (e) {
      this.getCommits(e);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
