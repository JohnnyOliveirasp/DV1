import Papa from 'papaparse';
import rawData from './loansize.csv';

const parseData = (result) => {
  // Removendo as duas primeiras linhas se forem cabeçalhos ou linhas vazias
  const data = result.data.slice(2).map((row) => ({
    year: row[0],
    quarter: row[1],
    grade: row[2],
    homeOwnership: row[3],
    term: row[4],
    currentBalance: row[5],
  }));

  // Filtrar quaisquer linhas que não tenham todos os campos necessários
  return data.filter((row) => row.year && row.quarter && row.grade && row.homeOwnership && row.term && row.currentBalance);
};

export const getData = async () => {
  const csvData = await fetch(rawData).then((response) => response.text());
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      complete: (result) => {
        const formattedData = parseData(result);
        resolve(formattedData);
      },
      error: (error) => reject(error),
    });
  });
};
