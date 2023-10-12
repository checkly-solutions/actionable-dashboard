import Image from 'next/image';
import styles from './page.module.css';
import AccountForm from './components/accountForm';
import ChecksTable from './components/checksTable';


export default function Home() {
  return (
    <main className={styles.main}>
      {/* <AccountForm></AccountForm> */}
      <ChecksTable></ChecksTable>
      <div className={styles.description}>hello world</div>
    </main>
  );
}
