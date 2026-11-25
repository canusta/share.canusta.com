import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import styles from "./page.module.css";
import { CopyButton } from "./CopyButton";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Monzo Details",
};

const details = [
  ["Bank", "Monzo"],
  ["Name", "Can Usta"],
  ["Account Number", "11907178"],
  ["Sort Code", "04-00-04"],
  ["Swift/BIC", "MONZGB2L"],
  ["IBAN", "GB33MONZ04000411907178"],
  ["Bank Address", "Broadwalk House 5 Appold Street London EC2A"],
];

export default function MonzoPage() {
  return (
    <main className={`${styles.page} ${ibmPlexMono.className}`}>
      <section className={styles.details} aria-labelledby="monzo-title">
        <h1 id="monzo-title" className={styles.title}>Monzo Details</h1>
        <a className={styles.paymentLink} href="http://monzo.me/canusta">
          monzo.me/canusta
        </a>
        <dl className={styles.list}>
          {details.map(([label, value]) => (
            <div key={label} className={styles.row}>
              <dt className={styles.label}>{label}</dt>
              <dd className={styles.value}>
                {value}
                <CopyButton label={label} value={value} />
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
