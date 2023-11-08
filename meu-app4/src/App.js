//realiza todos os imports necessario
import React, { useState, useEffect } from 'react';
import './App.css';
import Table from './components/Table';
import Dropdown from './components/Dropdown';
import BarChart from './components/BarChart';
import { getData } from './request/api';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [filters, setFilters] = useState({
    homeOwnership: '',
    quarter: '',
    term: '',
    year: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      setData(result);
      setFilteredData(result);
      calculateChartData(result);
    };

    fetchData().catch(console.error);
  }, []);

  const calculateChartData = (data) => {
    const grades = [...new Set(data.map(item => item.grade))];
    const balancesByGrade = grades.map(grade => {
      const total = data
        .filter(item => item.grade === grade)
        .reduce((sum, item) => sum + parseFloat(item.currentBalance), 0);
      return total.toFixed(2); // Arredonda para duas casas decimais
    });

    setChartData({
      labels: grades,
      datasets: [
        {
          label: 'Current Balance',
          data: balancesByGrade,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  // Função para atualizar os filtros e os dados filtrados
  const handleFilterChange = (filterType) => (event) => {
    const newFilters = { ...filters, [filterType]: event.target.value };
    setFilters(newFilters);

    const newFilteredData = data.filter((item) => {
      return Object.entries(newFilters).every(([key, value]) =>
        value ? item[key].toString() === value : true
      );
    });

    setFilteredData(newFilteredData);
    calculateChartData(newFilteredData);
  };

  // Função para resetar os filtros e os dados filtrados
  const handleResetFilters = () => {
    setFilters({
      homeOwnership: '',
      quarter: '',
      term: '',
      year: '',
    });
    setFilteredData(data);
    calculateChartData(data);
  };

  // Extraindo valores únicos para os filtros
  const homeOwnerships = [...new Set(data.map(item => item.homeOwnership))];
  const quarters = [...new Set(data.map(item => item.quarter))];
  const terms = [...new Set(data.map(item => item.term))];
  const years = [...new Set(data.map(item => item.year))];

  // Opções para o gráfico de barras
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Loan Size Dashboard</h1>
      </header>
      <div className="filters">
        <Dropdown
          label="Home Ownership"
          options={homeOwnerships}
          value={filters.homeOwnership}
          onChange={handleFilterChange('homeOwnership')}
        />
        <Dropdown
          label="Quarter"
          options={quarters}
          value={filters.quarter}
          onChange={handleFilterChange('quarter')}
        />
        <Dropdown
          label="Term"
          options={terms}
          value={filters.term}
          onChange={handleFilterChange('term')}
        />
        <Dropdown
          label="Year"
          options={years}
          value={filters.year}
          onChange={handleFilterChange('year')}
        />
        <button onClick={handleResetFilters}>Reset Filters</button>
      </div>
      <Table data={filteredData} />
      <div className="chart-container" style={{ position: 'relative', height: '40vh', width: '80vw' }}>
        <BarChart chartData={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default App;
