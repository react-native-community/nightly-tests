import InfoIcon from '~/public/icons/info-icon.svg';
import { LibraryType } from '~/types/data-types';

import Tooltip from './Tooltip';

type Props = { notes: LibraryType['notes'] };

export function EntryNotes({ notes }: Props) {
  if (!notes || !notes.length) {
    return null;
  }

  return (
    <Tooltip content={notes}>
      <button type="button" aria-label="Notes" className="rounded-sm">
        <InfoIcon className="size-3.5 text-secondary" />
      </button>
    </Tooltip>
  );
}
