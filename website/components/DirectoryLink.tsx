import DirectoryLogo from '~/public/icons/directory-icon.svg';

import Tooltip from './Tooltip';

type Props = { packageName?: string };

export function DirectoryLink({ packageName }: Props) {
  if (!packageName) {
    return <span className="text-secondary flex w-3.5 justify-center opacity-60 select-none">-</span>;
  }

  return (
    <Tooltip content="Visit React Native Directory page">
      <a
        href={`https://reactnative.directory/package/${packageName}`}
        target="_blank"
        aria-label="Visit React Native Directory page"
        className="rounded-sm transition-opacity hover:opacity-70">
        <DirectoryLogo className="text-secondary size-3.5" />
      </a>
    </Tooltip>
  );
}
