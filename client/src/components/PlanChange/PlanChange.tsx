import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PlanChange.module.css';
import type { Plan } from '../../services/plansService';

const PlanChange: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  
  const fetchPlans = async () => {
    // TODO: Implement API call to fetch plans
    setPlans([]);
  };
  
  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePlanClick = (planId: number) => {
    navigate(`/plan/${planId}`);
  };

  const handleNewPlan = () => {
    navigate('/plan/new');
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI Trip Assistant Prompt Management</h1>
        <button 
          className={styles.newButton}
          onClick={handleNewPlan}
        >
          New
        </button>
      </div>
      
      <table className={styles.plansTable}>
        <thead>
          <tr>
            <th>Plan Name</th>
          </tr>
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