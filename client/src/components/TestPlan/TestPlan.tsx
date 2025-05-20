import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './TestPlan.module.css';
import type { Plan, PlanResponse } from '../../services/plansService';
import { getPlanById } from '../../services/plansService';

interface VariableValues {
    [key: string]: string;
}

const TestPlan: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const [plan, setPlan] = useState<Plan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTesting, setIsTesting] = useState(false);
    const [variableValues, setVariableValues] = useState<VariableValues>({});
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<string | null>(null);

    useEffect(() => {
        if (!planId) {
            setError('No plan ID provided.');
            setIsLoading(false);
            return;
        }

        const id = parseInt(planId, 10);
        if (isNaN(id)) {
            setError('Invalid plan ID.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        getPlanById(id)
            .then(response => {
                setPlan(response.prompt);

                // Extract variables from userPrompt using regex
                const variablePattern = /\{([^}]+)\}/g;
                const matches = response.prompt.userPrompt.matchAll(variablePattern);
                const variables = Array.from(matches, match => match[1]);

                // Initialize variable values state
                const initialVariableValues: VariableValues = {};
                variables.forEach(variable => {
                    initialVariableValues[variable] = '';
                });
                setVariableValues(initialVariableValues);
            })
            .catch(err => {
                console.error('Error fetching plan:', err);
                setError('Failed to load plan.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [planId]);

    const handleVariableChange = (variableName: string, value: string) => {
        setVariableValues(prevValues => ({
            ...prevValues,
            [variableName]: value
        }));
    };

    const handleRunTest = async () => {
        if (!plan) return;

        // Check if all variables are filled
        const emptyVariables = Object.entries(variableValues)
            .filter(([_, value]) => !value.trim())
            .map(([key]) => key);

        if (emptyVariables.length > 0) {
            setError(`Please fill in all variables: ${emptyVariables.join(', ')}`);
            return;
        }

        setIsTesting(true);
        setError(null);
        setResponse(null);

        try {
            const response = await fetch('/api/test-plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    planId: plan.id,
                    variableValues,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from API');
            }

            const data = await response.json();
            setResponse(data.response);
        } catch (err) {
            console.error('Error running test:', err);
            setError('Failed to run test. Please try again.');
        } finally {
            setIsTesting(false);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}>
                    <div></div>
                    <div></div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className={styles.container}><p className={styles.error}>Error: {error}</p></div>;
    }

    if (!plan) {
        return <div className={styles.container}><p>Plan not found.</p></div>;
    }

    const variableNames = Object.keys(variableValues);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={handleBack}
                >
                    Back
                </button>
                <h1 className={styles.title}>Test Plan: {plan.planName}</h1>
                <button
                    className={styles.testButton}
                    onClick={handleRunTest}
                    disabled={isTesting}
                >
                    {isTesting ? 'Testing...' : 'Run Test'}
                </button>
            </div>

            <div className={styles.content}>
                <div className={styles.variablesSection}>
                    <h2>Variables</h2>
                    {variableNames.length > 0 ? (
                        variableNames.map(variableName => (
                            <div key={variableName} className={styles.formGroup}>
                                <label htmlFor={variableName}>{variableName}:</label>
                                <input
                                    type="text"
                                    id={variableName}
                                    value={variableValues[variableName] || ''}
                                    onChange={(e) => handleVariableChange(variableName, e.target.value)}
                                    className={styles.input}
                                    placeholder={`Enter value for ${variableName}`}
                                    disabled={isTesting}
                                />
                            </div>
                        ))
                    ) : (
                        <p>No variables found in the plan prompts.</p>
                    )}
                </div>

                {response && (
                    <div className={styles.responseSection}>
                        <h2>Response</h2>
                        <pre className={styles.responseText}>
                            {response}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestPlan; 