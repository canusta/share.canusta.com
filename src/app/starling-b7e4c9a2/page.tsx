import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { CopyButton } from "../monzo-9sm29vhza/CopyButton";
import styles from "../monzo-9sm29vhza/page.module.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Starling Details",
};

const details = [
  ["Bank", "Starling Bank"],
  ["Account Name", "Common Studio London Ltd"],
  ["Account Number", "55677875"],
  ["Sort Code", "608371"],
  ["SWIFT", "SRLGGB2L"],
  ["IBAN", "GB78SRLG60837155677875"],
];

export default function StarlingPage() {
  return (
    <main className={`${styles.page} ${ibmPlexMono.className}`}>
      <section className={styles.details} aria-labelledby="starling-title">
        <h1 id="starling-title" className={styles.title} style={{ marginBottom: 28 }}>
          Starling Details
        </h1>
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
