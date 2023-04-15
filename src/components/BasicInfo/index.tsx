import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import styles from './basicinfo.module.scss';

interface BasicInfoProps {
  publicationDate: string;
  author: string;
  minutes?: number;
}

export default function BasicInfo({
  publicationDate,
  author,
  minutes,
}: BasicInfoProps): JSX.Element {
  return (
    <>
      <div className={styles.info}>
        <div>
          <FiCalendar />
          <time>
            {format(new Date(publicationDate), 'dd MMM yyyy', {
              locale: ptBR,
            })}
          </time>
        </div>
        <div>
          <FiUser />
          <span>{author}</span>
        </div>
        {minutes ? (
          <div>
            <FiClock />
            <span>{`${minutes} min`}</span>
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  );
}
