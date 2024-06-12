import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import BarChart from './BarChart';

const Container = styled.div`
  font-family: 'Arial', sans-serif;
  margin: 20px auto;
  padding: 20px;
  max-width: 800px;
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const DataBlock = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
  flex: 1;
  &:last-child {
    margin-right: 0;
  }
`;

const DataText = styled.p`
  font-size: 16px;
  color: #666;
  margin: 5px 0;
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #777;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const TableHeader = styled.th`
  background-color: #f5f5f5;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  color: #555;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
  color: #555;
  font-size: 16px;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;

  @media (max-width: 767px) {
    flex-direction: column;
    gap: 0px;
  }
`;

const MeuComponente = () => {
  const [lampOnTime, setLampOnTime] = useState(null);
  const [registers, setRegisters] = useState(null);
  const [monthlyConsumption, setMonthlyConsumption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trueCount, setTrueCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2, response3] = await Promise.all([
          axios.get('https://smart-lighting-system-api.onrender.com/lamp-on-time'),
          axios.get('https://smart-lighting-system-api.onrender.com/registers'),
          axios.get('https://smart-lighting-system-api.onrender.com/monthly-consumption')
        ]);

        setLampOnTime(response1.data);
        setRegisters(response2.data);
        setMonthlyConsumption(response3.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const countTrueValues = () => {
      if (registers) {
        const trueRegisters = registers.filter(register => register.state === true);
        setTrueCount(trueRegisters.length);
      }
    };

    countTrueValues();
  }, [registers]);

  if (loading) return <LoadingMessage>Carregando...</LoadingMessage>;
  if (error) return <ErrorMessage>Erro: {error.message}</ErrorMessage>;

  let totalFormatted;

  if (lampOnTime && lampOnTime.totalOnTimeLast24Hours !== undefined) {
    const totalSeconds = lampOnTime.totalOnTimeLast24Hours;

    if (totalSeconds < 60) {
        totalFormatted = `${totalSeconds} segundos`;
    } else if (totalSeconds < 3600) {
        const totalMinutes = Math.floor(totalSeconds / 60);
        totalFormatted = `${totalMinutes} minutos`;
    } else {
        const totalHours = Math.floor(totalSeconds / 3600);
        totalFormatted = `${totalHours} horas`;
    }
  } else {
    totalFormatted = '0 horas';
  }

  const formattedMonthlyAverageConsumption = monthlyConsumption && monthlyConsumption.monthlyAverageConsumption.toFixed(5);
  const formattedMonthlyCost = monthlyConsumption && monthlyConsumption.monthlyCost.toFixed(5);

  const last10Registers = registers ? registers.slice(-10).reverse() : [];

  return (
    <Container>
      <FlexContainer>
        <DataBlock>
          <DataText>
            Tempo que a lâmpada ficou acesa nas últimas 24h:{' '}
            <span style={{ fontWeight: 'bold', color: 'green' }}>
              {totalFormatted}
            </span>
          </DataText>
        </DataBlock>
        <DataBlock>
          <DataText>
            Quantidade de vezes que a lâmpada acendeu:{' '}
            <span style={{ fontWeight: 'bold', color: 'green' }}>
              {trueCount}
            </span>
          </DataText>
        </DataBlock>
        <DataBlock>
          <DataText>
            Média mensal de consumo:{' '}
            <span style={{ fontWeight: 'bold', color: 'green' }}>
              {formattedMonthlyAverageConsumption} kWh
            </span>
          </DataText>
        </DataBlock>
        <DataBlock>
          <DataText>
            Custo mensal: R${' '}
            <span style={{ fontWeight: 'bold', color: 'green' }}>
              {formattedMonthlyCost}
            </span>
          </DataText>
        </DataBlock>
      </FlexContainer>
      <DataBlock>
        <BarChart />
      </DataBlock>
      <DataBlock>
        <Table>
          <thead>
            <tr>
              <TableHeader>Data/Hora</TableHeader>
              <TableHeader>Estado</TableHeader>
            </tr>
          </thead>
          <tbody>
            {last10Registers.map((register, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(register.timestamp).toLocaleString()}</TableCell>
                <TableCell>{register.state ? 'On' : 'Off'}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </DataBlock>
    </Container>
  );
};

export default MeuComponente;
