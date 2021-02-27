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
  paginationArray = [];

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

  getCommits(branch: string, customUrl: string): void {
    this.githubService.getCommits(branch, customUrl).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.paginationArray = this.generatePaginationArray(res.links);
      this.setCommits(res.data);
    });
  }

  generatePaginationArray(links: any): any {
    return links.map(x => {
      return {
        url: x.split(';')[0].replace('>', '').replace('<', ''),
        label: x.split(';')[1].replace('rel="', '').replace('"', '')
      };
    });
  }

  setCommits(commits: CommitInterface[]): void {
    const source = from(commits);
    const groupObs = source.pipe(
      groupBy((item: CommitInterface) => this.datePipe.transform(item.committer.date, 'yyyy-MM-dd')),
      mergeMap(group => group.pipe(toArray()))
    );
    groupObs.pipe(takeUntil(this.destroy$)).subscribe(val => this.commits.push(val));
  }

  changeBranch(e: string): void {
    this.commits = [];
    if (e) {
      this.getCommits(e, '');
    }
  }

  onPage(url: string): void {
    this.commits = [];
    this.getCommits('', url);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
