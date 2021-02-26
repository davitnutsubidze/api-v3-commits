export interface BranchInterface {
  name: string;
  protected: string;
  commit: {
    sha: string;
    url: string;
  };
}
