import ObjectsToCsv from "objects-to-csv";
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";

export const exportAsCsv = async (list) => {
  //   console.log(list);
  const csv = new ObjectsToCsv(list);
  await csv.toDisk("./tmp.csv");
  //   uploadCsv("./tmp.csv");
};

const uploadCsv = async (path) => {
  const filePath = path;
  const form = new FormData();
  const fileStream = fs.createReadStream(filePath);
  form.append("csv", fileStream);

  await fetch("https://booking.appartementvars.fr/data/csv", {
    method: "PUT",
    body: form,
  })
    .then((response) => response.json())
    .then((result) => console.log("success:", result))
    .catch((err) => console.log("error:", err));
};
