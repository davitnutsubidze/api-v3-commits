export interface CommitInterface {
  author: PersonInterface;
  comment_count: number;
  committer: PersonInterface;
  committerLogin: string;
  committerAvatar: string;
  message: string;
  tree: {
    sha: string;
    url: string;
  };
  url: string;
}

interface PersonInterface {
  date: Date;
  email: string;
  name: string;
}
