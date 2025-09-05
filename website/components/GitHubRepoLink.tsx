import GitHubLogo from "~/public/github.svg";

import Tooltip from "./Tooltip";

type Props = { repositoryURL?: string };

export function GitHubRepoLink({ repositoryURL }: Props) {
  if (!repositoryURL) {
    return (
      <span className="w-3.5 text-center text-secondary select-none">-</span>
    );
  }

  return (
    <Tooltip content="Visit GitHub repository">
      <a
        href={repositoryURL}
        target="_blank"
        className="transition-opacity hover:opacity-70"
      >
        <GitHubLogo className="size-3.5 text-secondary" />
      </a>
    </Tooltip>
  );
}
