import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PlanChange.module.css';

interface Plan {
  id: string;
  name: string;
  prompt: string;
}

const PlanChange: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([
    { id: 'standard', name: 'Standard Plan', prompt: '' },
    { id: 'detailed', name: 'Detailed Plan', prompt: '' },
    { id: 'fullControl', name: 'Full Control Plan', prompt: '' },
  ]);
  
  // Mock function to fetch plans - replace with actual API call
  const fetchPlans = async () => {
    const mockPlans = [
      { id: 'standard', name: 'Standard Plan', prompt: 'Create a simple travel itinerary with basic points of interest.' },
      { id: 'detailed', name: 'Detailed Plan', prompt: 'Create a comprehensive travel itinerary with detailed schedule, landmarks, and local cuisine recommendations.' },
      { id: 'fullControl', name: 'Full Control Plan', prompt: 'Create a fully customizable travel plan with transportation options, accommodation suggestions, and activities with time slots.' },
    ];
    
    setPlans(mockPlans);
  };
  
  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePlanClick = (planId: string) => {
    navigate(`/plan/${planId}`);
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>AI Trip Assistant Prompt Management</h1>
      
      <table className={styles.plansTable}>
        <thead>
        </thead>
        <tbody>
          {plans.map(plan => (
            <tr 
              key={plan.id}
              onClick={() => handlePlanClick(plan.id)}
              className={styles.clickableRow}
            >
              <td>{plan.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanChange;