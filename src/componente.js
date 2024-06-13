import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ChartBlock from './ChartBlock';

const Container = styled.div`
  font-family: 'Arial', sans-serif;
  margin: 20px auto;
  padding: 10px;
  width: 1000px;
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  @media (max-width: 1200px) {
    width: 800px;
  }

  @media (max-width: 992px) {
    width: 768px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DataBlock = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
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
  flex-direction: column;
`;

const Title = styled.h3`
  color: #333;
`;

const Dashboard = () => {
  const [soilMoistureData, setSoilMoistureData] = useState([]);
  const [lightSensorData, setLightSensorData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [registers, setRegisters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2, response3, response4, response5] = await Promise.all([
          axios.get('http://localhost:3000/soil-moisture-data'),
          axios.get('http://localhost:3000/light-sensor-data'),
          axios.get('http://localhost:3000/temperature-data'),
          axios.get('http://localhost:3000/alerts'),
          axios.get('http://localhost:3000/registers')
        ]);

        setSoilMoistureData(response1.data);
        setLightSensorData(response2.data);
        setTemperatureData(response3.data);
        setAlerts(response4.data);
        setRegisters(response5.data.slice(-10).reverse());
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingMessage>Carregando...</LoadingMessage>;
  if (error) return <ErrorMessage>Erro: {error.message}</ErrorMessage>;

  const filteredAlerts = alerts.filter(alert => alert.status === 'NOT OK');

  return (
    <Container>
      <FlexContainer>
        <ChartBlock title="Umidade do Solo %" data={soilMoistureData} dataKey="soil_moisture" />
        <ChartBlock title="Intensidade da Luz (lux)" data={lightSensorData} dataKey="light_sensor" />
        <ChartBlock title="Temperatura Ambiente °C" data={temperatureData} dataKey="temperature" />
      </FlexContainer>
      <DataBlock>
        <Title>Alertas de Umidade</Title>
        <Table>
          <thead>
            <tr>
              <TableHeader>Dispositivo</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Data/Hora</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map((alert, index) => (
              <TableRow key={index}>
                <TableCell>{alert.device_id}</TableCell>
                <TableCell>{alert.status}</TableCell>
                <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </DataBlock>
      <DataBlock>
        <Title>Últimos 10 Registros</Title>
        <Table>
          <thead>
            <tr>
              <TableHeader>Device</TableHeader>
              <TableHeader>Solo</TableHeader>
              <TableHeader>Luz</TableHeader>
              <TableHeader>Temperatura</TableHeader>
              <TableHeader>Data/Hora</TableHeader>
            </tr>
          </thead>
          <tbody>
            {registers.map((register, index) => (
              <TableRow key={index}>
                <TableCell>{register.device_id}</TableCell>
                <TableCell>{register.soil_moisture}</TableCell>
                <TableCell>{register.light_sensor}</TableCell>
                <TableCell>{register.temperature}</TableCell>
                <TableCell>{new Date(register.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </DataBlock>
    </Container>
  );
};

export default Dashboard;
