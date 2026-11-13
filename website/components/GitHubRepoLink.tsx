import GitHubLogo from '~/public/icons/github-icon.svg';

import Tooltip from './Tooltip';

type Props = { repositoryURL?: string };

export function GitHubRepoLink({ repositoryURL }: Props) {
  if (!repositoryURL) {
    return <span className="text-secondary flex w-3.5 justify-center opacity-60 select-none">-</span>;
  }

  return (
    <Tooltip content="Visit GitHub repository">
      <a
        href={repositoryURL}
        target="_blank"
        aria-label="Visit package GitHub repository"
        className="rounded-sm transition-opacity hover:opacity-70">
        <GitHubLogo className="text-secondary size-3.5" />
      </a>
    </Tooltip>
  );
}
