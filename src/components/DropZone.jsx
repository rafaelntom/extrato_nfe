import { useRef, useState } from "react";
import { FileText, Upload } from "lucide-react";
import styles from "./DropZone.module.css";

export function DropZone({ fileName, onFile }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (file && file.name.endsWith(".xml")) onFile(file);
  };

  return (
    <div
      className={`${styles.zone} ${dragging ? styles.dragging : ""} ${fileName ? styles.loaded : ""}`}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xml"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {fileName ? (
        <>
          <FileText size={28} className={styles.iconLoaded} />
          <span className={styles.fileNameText}>{fileName}</span>
          <span className={styles.change}>Clique para trocar o arquivo</span>
        </>
      ) : (
        <>
          <Upload size={28} className={styles.iconIdle} />
          <strong>Arraste o XML aqui ou clique para selecionar</strong>
          <span>NF-e padrão SEFAZ (.xml)</span>
        </>
      )}
    </div>
  );
}
