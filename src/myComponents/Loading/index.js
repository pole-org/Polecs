import {Icon} from 'antd';
import styles from './index.less';

const Loading = ({show, tip}) => {
  return (
    <div>
      {show ?
        <div className={styles.loadingMask}>
          <div className={styles.loadingSpinner}>
            <Icon type="loading" />
            <p className={styles.loadingText}>{tip}</p>
          </div>
        </div>
        : null
      }
    </div>
  );
}

export default Loading;

