import React, { useEffect, useState, useCallback } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "./App.css"

const App = () => {
  const [accessToken, setAccessToken] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  useEffect(() => {
    
    getAccessTokenAndCompanyId();
  }, []);

  const getAccessTokenAndCompanyId = async () => {
    try {
      const response = await fetch('https://stage.api.sloovi.com/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'smithwills1989@gmail.com',
          password: '12345678',
        }),
      });
      const data = await response.json();
      setAccessToken(data.access_token);
      setCompanyId(data.company_id);
    } catch (error) {
      console.error(error);
    }
  };

  const getTeamMembers = useCallback(async () => {
    try {
      const response = await fetch(
        `https://stage.api.sloovi.com/team?product=outreach&company_id=${companyId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setTeamMembers(data);
    } catch (error) {
      console.error(error);
    }
  }, [companyId, accessToken]);

  const addTask = async () => {
    try {
      const url = `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2?company_id=${companyId}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assigned_user: selectedUserId,
          task_date: taskDate,
          task_time: taskTime,
          is_completed: 0,
          time_zone: 0, 
          task_msg: taskDescription,
        }),
      });
      const data = await response.json();
      console.log(data); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTask = () => {
    addTask();
  };

  const handleCancel = () => {
    
    setSelectedUserId('');
    setTaskDate('');
    setTaskTime('');
    setTaskDescription('');
  };

  useEffect(() => {
    if (companyId) {
      getTeamMembers();
    }
  }, [companyId, getTeamMembers]);

  return (
    <Container className="mt-4 border p-4 rounded w-25 custom-box-bg">
      <h1>Task 1</h1>
      <Form>
      <Form.Group controlId="taskDescription">
          <Form.Label>Task Description:</Form.Label>
          <Form.Control
            as="textarea"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            
          />
        </Form.Group>
        
        <Form.Group controlId="taskDate">
          <Form.Label>Task Date:</Form.Label>
          <Form.Control
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            
          />
        </Form.Group>
        <Form.Group controlId="taskTime">
          <Form.Label>Task Time:</Form.Label>
          <Form.Control
            type="time"
            value={taskTime}
            onChange={(e) => setTaskTime(e.target.value)}
            
          />
        </Form.Group>
        <Form.Group controlId="userSelect">
          <Form.Label>Assigned User:</Form.Label>
          <Form.Control
            as="select"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            
          >
            <option value="">Select User</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        
        <div className="d-flex gap-2 pt-3">
          <Button variant="primary" onClick={handleAddTask}>
            Save
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default App;
