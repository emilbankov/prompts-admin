import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TestPlan.module.css';
import type { Plan } from '../../services/plansService';
import { getPlans } from '../../services/plansService';

const TestPlan: React.FC = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [variables, setVariables] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await getPlans();
                setPlans(response.prompts);
            } catch (error) {
                console.error('Error fetching plans:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handlePlanChange = (planId: string) => {
        const plan = plans.find(p => p.id.toString() === planId);
        setSelectedPlan(plan || null);
        
        // Initialize variables from the selected plan
        if (plan) {
            const systemVars = plan.systemVariables ? JSON.parse(plan.systemVariables) : {};
            const userVars = plan.userVariables ? JSON.parse(plan.userVariables) : {};
            setVariables({ ...systemVars, ...userVars });
        }
    };

    const handleVariableChange = (name: string, value: string) => {
        setVariables(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTest = () => {
        // TODO: Implement test functionality
        console.log('Testing plan with variables:', variables);
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Test Plan</h1>
                <button
                    className={styles.backButton}
                    onClick={() => navigate('/')}
                >
                    Back
                </button>
            </div>

            <div className={styles.content}>
                <div className={styles.formGroup}>
                    <label htmlFor="planSelect">Select Plan</label>
                    <select
                        id="planSelect"
                        value={selectedPlan?.id || ''}
                        onChange={(e) => handlePlanChange(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">Select a plan</option>
                        {plans.map(plan => (
                            <option key={plan.id} value={plan.id}>
                                {plan.planName}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedPlan && (
                    <div className={styles.variablesSection}>
                        <h2>Variables</h2>
                        {Object.keys(variables).map(variableName => (
                            <div key={variableName} className={styles.formGroup}>
                                <label htmlFor={variableName}>{variableName}</label>
                                <input
                                    type="text"
                                    id={variableName}
                                    value={variables[variableName] || ''}
                                    onChange={(e) => handleVariableChange(variableName, e.target.value)}
                                    className={styles.input}
                                    placeholder={`Enter ${variableName}`}
                                />
                            </div>
                        ))}
                        <button
                            className={styles.testButton}
                            onClick={handleTest}
                        >
                            Run Test
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestPlan; 