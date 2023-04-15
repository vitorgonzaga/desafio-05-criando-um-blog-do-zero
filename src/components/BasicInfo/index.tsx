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
  //   const [time, setTime] = useState(0);

  //   const calculateTime = (): number => {
  //     if (minutes > 60) {
  //       return minutes / 60;
  //     }
  //     if (minutes === 60) {
  //       return 1;
  //     }
  //     return minutes;
  //   };

  //   useEffect(() => {
  //     setTime(calculateTime());
  //   }, [minutes]);

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
