export type LibraryType = {
  library: string;
  results: Record<
    string,
    {
      android?: "success" | "failure";
      ios?: "success" | "failure";
    }
  >;
};
