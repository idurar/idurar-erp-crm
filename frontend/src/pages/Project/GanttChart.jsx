import React, { useEffect, useState } from 'react';
import { Gantt } from '@svar-ui/react-gantt';
import '@svar-ui/react-gantt/all.css';
import axios from 'axios';

const GanttChart = () => {
  const [data, setData] = useState(null);
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    // Fetch project data from the API
    const fetchProjectData = async () => {
      try {
        const response = await axios.get('/api/project');
        const projects = response.data.result;

        // For simplicity, we'll just use the first project for now
        if (projects.length > 0) {
          const currentProjectId = projects[0]._id;
          setProjectId(currentProjectId);
          const taskResponse = await axios.get(`/api/task/project/${currentProjectId}`);
          const tasks = taskResponse.data.result.map(task => ({
            id: task._id,
            name: task.name,
            start: task.startDate,
            end: task.endDate,
            dependencies: task.dependencies,
          }));
          setData(tasks);
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProjectData();
  }, []);

  const handleTaskUpdate = async (task) => {
    try {
      await axios.put(`/api/task/${task.id}`, task);
      const newData = data.map(t => (t.id === task.id ? task : t));
      setData(newData);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleTaskCreate = async (task) => {
    try {
      const response = await axios.post('/api/task', { ...task, project: projectId });
      setData([...data, response.data.result]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await axios.delete(`/api/task/${taskId}`);
      const newData = data.filter(t => t.id !== taskId);
      setData(newData);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };


  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Project Gantt Chart</h1>
      <Gantt
        tasks={data}
        onTaskUpdate={handleTaskUpdate}
        onTaskCreate={handleTaskCreate}
        onTaskDelete={handleTaskDelete}
        />
    </div>
  );
};

export default GanttChart;
