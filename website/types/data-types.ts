export type LibraryType = {
  library: string;
  installCommand: string;
  repositoryURLs?: Record<string, string>;
  notes: string;
  results: Record<
    string,
    {
      android?: "success" | "failure";
      ios?: "success" | "failure";
      runUrl?: string;
    }
  >;
};
