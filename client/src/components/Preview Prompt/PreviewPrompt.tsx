import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './PreviewPrompt.module.css';
import type { Plan } from '../../services/plansService';
import { getPlanById } from '../../services/plansService';

const PreviewPrompt: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const [plan, setPlan] = useState<Plan | null>(null);
    const [variableValues, setVariableValues] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!planId) {
            navigate('/');
            return;
        }

        getPlanById(parseInt(planId, 10))
            .then(response => {
                setPlan(response.prompt);
                const systemVariables = JSON.parse(response.prompt.systemVariables || '[]');
                const userVariables = JSON.parse(response.prompt.userVariables || '[]');
                const initialValues: { [key: string]: string } = {};
                [...systemVariables, ...userVariables].forEach(v => initialValues[v] = '');
                setVariableValues(initialValues);
            })
            .catch(() => navigate('/'))
            .finally(() => setIsLoading(false));
    }, [planId, navigate]);

    const getFilledPrompt = (prompt: string): string => {
        let filledPrompt = prompt;
        Object.entries(variableValues).forEach(([key, value]) => {
            filledPrompt = filledPrompt.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
        });
        return filledPrompt;
    };

    const handleBack = () => {
        navigate('/');
    };

    if (isLoading || !plan) {
        return <div className={styles.loadingContainer}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={handleBack}
                >
                    Back
                </button>
                <h1 className={styles.title}>Preview Plan: {plan.planName}</h1>
            </div>
            <div className={styles.content}>
                <div className={styles.previewSection}>
                    <div className={styles.promptSection}>
                        <h2>System Prompt</h2>
                        <pre className={styles.promptPreview}>
                            {getFilledPrompt(plan.systemPrompt)}
                        </pre>
                    </div>
                    <div className={styles.promptSection}>
                        <h2>User Prompt</h2>
                        <pre className={styles.promptPreview}>
                            {getFilledPrompt(plan.userPrompt)}
                        </pre>
                    </div>
                    <div className={styles.modelSection}>
                        <h2>Model Configuration</h2>
                        <div className={styles.modelDetails}>
                            <p><strong>Model:</strong> {plan.model}</p>
                            {plan.maxCompletionTokens && (
                                <p><strong>Max Tokens:</strong> {plan.maxCompletionTokens}</p>
                            )}
                            {plan.temperature && (
                                <p><strong>Temperature:</strong> {plan.temperature}</p>
                            )}
                            {plan.topP && (
                                <p><strong>Top P:</strong> {plan.topP}</p>
                            )}
                            {plan.frequencyPenalty && (
                                <p><strong>Frequency Penalty:</strong> {plan.frequencyPenalty}</p>
                            )}
                            {plan.presencePenalty && (
                                <p><strong>Presence Penalty:</strong> {plan.presencePenalty}</p>
                            )}
                            {plan.reasoningEffort && (
                                <p><strong>Reasoning Effort:</strong> {plan.reasoningEffort}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewPrompt; 