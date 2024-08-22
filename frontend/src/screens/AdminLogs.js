import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Table, Container } from 'react-bootstrap';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        // Adjust the endpoint as necessary
        const { data } = await axios.get('/api/logs', config);
        
        // Debug log to inspect the response data
        console.log('Logs data:', data);

        setLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error); // Log error details
        setError('Failed to fetch the logs');
      }
    };

    fetchLogs();
  }, [userInfo]);

  return (
    <Container>
      <h1>Admin Logs</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER ID</th>
              <th>ACTION</th>
              <th>MESSAGE</th>
              <th>DATE</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}> {/* Use index if log._id is not unique */}
                <td>{log._id || index}</td> {/* Adjust based on actual data structure */}
                <td>{log.userId}</td> {/* Adjust based on actual data structure */}
                <td>{log.action}</td>
                <td>{log.message || 'N/A'}</td> {/* Provide default value if message is missing */}
                <td>{new Date(log.timestamp).toLocaleString()}</td> {/* Adjust date field */}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminLogs;
