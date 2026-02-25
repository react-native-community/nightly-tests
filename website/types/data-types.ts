export type LibraryType = {
  library: string;
  installCommand: string;
  repositoryURLs?: Record<string, string>;
  notes: string;
  results: Record<
    string,
    {
      android: PlatformStatus;
      ios: PlatformStatus;
      runUrl?: string;
    }
  >;
};

export type PlatformStatus = 'success' | 'failure' | undefined;
