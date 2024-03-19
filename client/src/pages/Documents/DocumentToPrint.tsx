import React from "react";
import { PrintContent } from "./DocumentsStyles";
import dayjs from "dayjs";

interface Props {
  branch: string;
  documents: any[];
  total: number;
  startDate: Date | null;
  endDate: Date | null;
  today: Date | null;
}

const DocumentToPrint = React.forwardRef<HTMLDivElement, Props>(
  ({ branch, documents, total, startDate, endDate, today }, ref) => {
    return (
      <PrintContent ref={ref}>
        <div className="header">
          <h3>PANINO HVAR d.o.o.</h3>
          <p>Vrisnik 109</p>
          <p>OIB: 20008649741</p>
          <p>IBAN: HR8923400091111216174</p>
          <p>Datum: {dayjs(today).format("DD.MM.YYYY.")}</p>
        </div>
        <div className="branch">
          <p>Poslovnica: {branch}</p>
        </div>
        <div className="printInfo">
          <p>
            {startDate && endDate
              ? `Od ${dayjs(startDate).format("DD.MM.YYYY.")} do ${dayjs(
                  endDate
                ).format("DD.MM.YYYY.")}`
              : "Svi datumi"}
          </p>
          <p>Ukupno: {total.toFixed(2)}€</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Red br.</th>
              <th>Datum upisa isprave</th>
              <th>Naziv i broj isprave</th>
              <th>Zaduženje [€]</th>
              <th>Razduženje [€]</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.Id}>
                <td>{doc.Id}</td>
                <td>{dayjs(doc.Date).format("DD.MM.YYYY.")}</td>
                <td>{doc.Title}</td>
                <td>{doc.Type === 1 ? doc.Value : ""}</td>
                <td>{doc.Type === 2 ? doc.Value : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PrintContent>
    );
  }
);

export default DocumentToPrint;
