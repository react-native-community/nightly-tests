import GitHubLogo from "~/public/github.svg";

type Props = { repositoryURL?: string };

export function GitHubRepoLink({ repositoryURL }: Props) {
  if (!repositoryURL) {
    return null;
  }

  return (
    <a
      href={repositoryURL}
      target="_blank"
      className="ml-auto transition-opacity hover:opacity-70"
    >
      <GitHubLogo className="size-3.5 text-secondary" />
    </a>
  );
}
