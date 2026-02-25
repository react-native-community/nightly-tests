import InfoIcon from '~/public/icons/info-icon.svg';

import Tooltip from './Tooltip';

type Props = { notes: string };

export function EntryNotes({ notes }: Props) {
  if (!notes.length) {
    return null;
  }

  return (
    <Tooltip content={notes}>
      <button type="button" aria-label="Notes">
        <InfoIcon className="size-3.5 text-secondary" />
      </button>
    </Tooltip>
  );
}
