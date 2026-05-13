import { COLS_A, COLS_B } from "../utils/columns.js";
import styles from "./ResultTable.module.css";

export function ResultTable({ rows }) {
  if (!rows.length) return null;

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.groupRow}>
            <th colSpan={COLS_A.length} className={styles.groupA}>
              ICMS PRÓPRIO
            </th>
            <th colSpan={COLS_B.length} className={styles.groupB}>
              ICMS ST / SUBSTITUIÇÃO TRIBUTÁRIA
            </th>
          </tr>
          <tr className={styles.colRow}>
            {COLS_A.map((c, i) => (
              <th
                key={c.key}
                className={`${styles.th} ${i === COLS_A.length - 1 ? styles.sepCol : ""} ${c.empty ? styles.emptyTh : ""}`}
              >
                {c.label}
              </th>
            ))}
            {COLS_B.map((c) => (
              <th key={c.key} className={`${styles.th} ${styles.thST}`}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className={styles.row}>
              {COLS_A.map((c, i) => (
                <td
                  key={c.key}
                  className={`${styles.td} ${i === COLS_A.length - 1 ? styles.sepCol : ""} ${c.empty ? styles.emptyTd : ""} ${c.key === "chave" ? styles.mono : ""}`}
                >
                  {c.empty
                    ? ""
                    : c.key === "chave" || c.key === "cnpjForn"
                      ? `'${r[c.key] !== undefined ? r[c.key] : ""}`
                      : r[c.key] !== undefined
                        ? r[c.key]
                        : "—"}
                </td>
              ))}
              {COLS_B.map((c) => (
                <td key={c.key} className={`${styles.td} ${styles.tdST}`}>
                  {r[c.key] || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
