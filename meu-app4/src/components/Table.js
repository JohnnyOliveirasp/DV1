import React from 'react';

const Table = ({ data }) => {
  // Encontrar valores únicos de 'grade'
  const uniqueGrades = [...new Set(data.map(item => item.grade))].sort();

  // Calcular a agregação de 'currentBalance' para cada 'grade'
  const balanceByGrade = uniqueGrades.map(grade =>
    data
      .filter(item => item.grade === grade)
      .reduce((sum, item) => sum + parseFloat(item.currentBalance), 0)
      .toFixed(2) // Arredondar para duas casas decimais
  );

  return (
    <table>
      <thead>
        <tr>
          {uniqueGrades.map(grade => (
            <th key={grade}>{`Grade ${grade}`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {balanceByGrade.map((balance, index) => (
            <td key={uniqueGrades[index]}>{balance}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default Table;
