export type LibraryType = {
  library: string;
  installCommand: string;
  repositoryURLs?: Record<string, string>;
  githubUrl?: string;
  notes?: string;
  setupScript?: string;
  results: Record<
    string,
    {
      android: PlatformStatus;
      ios: PlatformStatus;
      runUrl?: string;
    }
  >;
};

export type DisplayMode = 'all' | 'failing';

export type PlatformStatus = 'success' | 'failure' | undefined;
