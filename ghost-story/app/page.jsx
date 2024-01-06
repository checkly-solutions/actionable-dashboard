import styles from './page.module.css';
import ChecksTable from './components/checksTable.jsx';


export default function Home() {
  return (
    <main className={styles.main}>
      <ChecksTable></ChecksTable>
    </main>
  );
}
