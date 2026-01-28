import DirectoryLogo from '~/public/icons/directory-icon.svg';

import Tooltip from './Tooltip';

type Props = { packageName?: string };

export function DirectoryLink({ packageName }: Props) {
  if (!packageName) {
    return (
      <span className="w-3.5 text-center text-secondary opacity-60 select-none">
        -
      </span>
    );
  }

  return (
    <Tooltip content="Visit React Native Directory page">
      <a
        href={`https://reactnative.directory/package/${packageName}`}
        target="_blank"
        aria-label="Visit React Native Directory page"
        className="transition-opacity hover:opacity-70">
        <DirectoryLogo className="size-3.5 text-secondary" />
      </a>
    </Tooltip>
  );
}
