import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './EditPlan.module.css';
import type { Plan, PlanResponse } from '../../services/plansService';
import { getPlanById, updatePlan } from '../../services/plansService';
import axios from 'axios';
import { getFieldValidationMessage } from '../../utils/validation';

const AI_MODELS = [
    'gpt-4.1',
    'gpt-4.1-mini',
    'gpt-4.1-nano',
    'o3',
    'o3-mini',
    'o4-mini'
];

const REASONING_EFFORT_OPTIONS = [
    'low',
    'medium',
    'high'
];

const extractVariables = (text: string): string[] => {
    const regex = /{([^}]+)}/g;
    const matches = text.match(regex) || [];
    const uniqueVariables = new Set(matches.map(match => match.slice(1, -1)));
    return Array.from(uniqueVariables);
};

interface ValidationErrors {
    [key: string]: string;
}

const EditPlan: React.FC = () => {
    const navigate = useNavigate();
    const { planId } = useParams<{ planId: string }>();
    const [formData, setFormData] = useState<Plan>({
        id: undefined as unknown as number,
        planName: '',
        systemPrompt: '',
        systemVariables: '',
        userPrompt: '',
        userVariables: '',
        model: '',
        reasoningEffort: ''
    });
    const [copiedVar, setCopiedVar] = useState<{ name: string; source: 'system' | 'user' } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [systemVariables, setSystemVariables] = useState<string[]>([]);
    const [userVariables, setUserVariables] = useState<string[]>([]);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                if (planId) {
                    const response = await getPlanById(parseInt(planId));
                    console.log(response);
                    
                    setFormData(response.prompt);
                }
            } catch (error) {
                console.error('Error fetching plan:', error);
                // TODO: Show error message to user
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlan();
    }, [planId]);

    useEffect(() => {
        setSystemVariables(extractVariables(formData.systemPrompt));
        setUserVariables(extractVariables(formData.userPrompt));
    }, [formData.systemPrompt, formData.userPrompt]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['maxCompletionTokens', 'frequencyPenalty', 'presencePenalty', 'temperature', 'topP'].includes(name)
                ? value === '' ? undefined : Number(value)
                : value
        }));
    };

    const validateForm = () => {
        const errors: ValidationErrors = {};
        
        // Required text fields
        if (!formData.planName.trim()) {
            errors.planName = 'Plan name is required';
        }
        if (!formData.systemPrompt.trim()) {
            errors.systemPrompt = 'System prompt is required';
        }
        if (!formData.userPrompt.trim()) {
            errors.userPrompt = 'User prompt is required';
        }
        if (!formData.model) {
            errors.model = 'AI model is required';
        }
        
        // Required numeric fields
        if (formData.maxCompletionTokens === undefined) {
            errors.maxCompletionTokens = 'Max completion tokens is required';
        } else {
            const errorMessage = getFieldValidationMessage('maxCompletionTokens', formData.maxCompletionTokens);
            if (errorMessage) errors.maxCompletionTokens = errorMessage;
        }
        
        // Model-specific required fields
        if (isOModel) {
            if (!formData.reasoningEffort) {
                errors.reasoningEffort = 'Reasoning effort is required for O models';
            }
        } else {
            if (formData.frequencyPenalty === undefined) {
                errors.frequencyPenalty = 'Frequency penalty is required';
            } else {
                const errorMessage = getFieldValidationMessage('frequencyPenalty', formData.frequencyPenalty);
                if (errorMessage) errors.frequencyPenalty = errorMessage;
            }
            
            if (formData.presencePenalty === undefined) {
                errors.presencePenalty = 'Presence penalty is required';
            } else {
                const errorMessage = getFieldValidationMessage('presencePenalty', formData.presencePenalty);
                if (errorMessage) errors.presencePenalty = errorMessage;
            }
            
            if (formData.temperature === undefined) {
                errors.temperature = 'Temperature is required';
            } else {
                const errorMessage = getFieldValidationMessage('temperature', formData.temperature);
                if (errorMessage) errors.temperature = errorMessage;
            }
            
            if (formData.topP === undefined) {
                errors.topP = 'Top P is required';
            } else {
                const errorMessage = getFieldValidationMessage('topP', formData.topP);
                if (errorMessage) errors.topP = errorMessage;
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        // Validate form on save
        if (!validateForm()) {
            return;
        }

        try {
            if (!planId) return;
            
            const { id, systemVariables, userVariables, ...planData } = formData;
            
            const formattedData = {
                ...planData,
                maxCompletionTokens: planData.maxCompletionTokens || undefined,
                frequencyPenalty: planData.frequencyPenalty || undefined,
                presencePenalty: planData.presencePenalty || undefined,
                temperature: planData.temperature || undefined,
                topP: planData.topP || undefined,
                reasoningEffort: planData.reasoningEffort || undefined
            };

            console.log('Sending plan data to backend:', formattedData);
            await updatePlan(parseInt(planId), formattedData);
            navigate('/');
        } catch (error) {
            console.error('Error updating plan:', error);
            if (axios.isAxiosError(error)) {
                console.error('Error details:', error.response?.data);
            }
            // TODO: Show error message to user
        }
    };

    const handleCopyVariable = (variable: string, source: 'system' | 'user') => {
        navigator.clipboard.writeText(`{${variable}}`);
        setCopiedVar({ name: variable, source });
        setTimeout(() => setCopiedVar(null), 2000);
    };

    const isOModel = formData.model.startsWith('o');

    if (isLoading) {
        return <div className={styles.container}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Edit Plan</h1>
                <div className={styles.actionButtons}>
                    <button className={styles.saveButton} onClick={handleSave}>Save Changes</button>
                    <button className={styles.cancelButton} onClick={() => navigate('/')}>Back to Plans</button>
                </div>
            </div>

            <form className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="planName">Plan Name</label>
                    <input
                        type="text"
                        id="planName"
                        name="planName"
                        value={formData.planName}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder='e.g., Standard Plan'
                        required
                    />
                    {validationErrors.planName && (
                        <span className={styles.error}>{validationErrors.planName}</span>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="systemPrompt">System Prompt</label>
                    <textarea
                        id="systemPrompt"
                        name="systemPrompt"
                        value={formData.systemPrompt}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        rows={4}
                        placeholder="Enter system prompt with variables in curly braces, e.g., {role}, {expertise}"
                        required
                    />
                    {validationErrors.systemPrompt && (
                        <span className={styles.error}>{validationErrors.systemPrompt}</span>
                    )}
                </div>

                {systemVariables.length > 0 && (
                    <div className={styles.variablesContainer}>
                        <h3>System Prompt Variables</h3>
                        <div className={styles.variablesList}>
                            {systemVariables.map(variable => (
                                <button
                                    key={variable}
                                    type="button"
                                    onClick={() => handleCopyVariable(variable, 'system')}
                                    className={`${styles.variableButton} ${copiedVar?.name === variable && copiedVar?.source === 'system' ? styles.copied : ''}`}
                                >
                                    {variable}
                                    {copiedVar?.name === variable && copiedVar?.source === 'system' && <span className={styles.copyIndicator}>✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label htmlFor="userPrompt">User Prompt</label>
                    <textarea
                        id="userPrompt"
                        name="userPrompt"
                        value={formData.userPrompt}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        rows={4}
                        placeholder="Enter user prompt with variables in curly braces, e.g., {location}, {duration}"
                        required
                    />
                    {validationErrors.userPrompt && (
                        <span className={styles.error}>{validationErrors.userPrompt}</span>
                    )}
                </div>

                {userVariables.length > 0 && (
                    <div className={styles.variablesContainer}>
                        <h3>User Prompt Variables</h3>
                        <div className={styles.variablesList}>
                            {userVariables.map(variable => (
                                <button
                                    key={variable}
                                    type="button"
                                    onClick={() => handleCopyVariable(variable, 'user')}
                                    className={`${styles.variableButton} ${copiedVar?.name === variable && copiedVar?.source === 'user' ? styles.copied : ''}`}
                                >
                                    {variable}
                                    {copiedVar?.name === variable && copiedVar?.source === 'user' && <span className={styles.copyIndicator}>✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label htmlFor="model">AI Model</label>
                    <select
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        className={styles.select}
                        required
                    >
                        <option value="" disabled>Select a model</option>
                        {AI_MODELS.map(model => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                    {validationErrors.model && (
                        <span className={styles.error}>{validationErrors.model}</span>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="maxCompletionTokens">Max Completion Tokens</label>
                    <input
                        type="number"
                        id="maxCompletionTokens"
                        name="maxCompletionTokens"
                        value={formData.maxCompletionTokens || ''}
                        onChange={handleInputChange}
                        className={styles.input}
                        min="0"
                        required
                    />
                    {validationErrors.maxCompletionTokens && (
                        <span className={styles.error}>{validationErrors.maxCompletionTokens}</span>
                    )}
                </div>

                {isOModel && (
                    <div className={styles.formGroup}>
                        <label htmlFor="reasoningEffort">Reasoning Effort</label>
                        <select
                            id="reasoningEffort"
                            name="reasoningEffort"
                            value={formData.reasoningEffort || ''}
                            onChange={handleInputChange}
                            className={styles.select}
                            required
                        >
                            <option value="" disabled>Select reasoning effort</option>
                            {REASONING_EFFORT_OPTIONS.map(option => (
                                <option key={option} value={option}>
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </option>
                            ))}
                        </select>
                        {validationErrors.reasoningEffort && (
                            <span className={styles.error}>{validationErrors.reasoningEffort}</span>
                        )}
                    </div>
                )}

                {!isOModel && (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="frequencyPenalty">Frequency Penalty (-2 to 2)</label>
                            <input
                                type="number"
                                id="frequencyPenalty"
                                name="frequencyPenalty"
                                value={formData.frequencyPenalty || ''}
                                onChange={handleInputChange}
                                className={styles.input}
                                min="-2"
                                max="2"
                                step="0.1"
                                required
                            />
                            {validationErrors.frequencyPenalty && (
                                <span className={styles.error}>{validationErrors.frequencyPenalty}</span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="presencePenalty">Presence Penalty (-2 to 2)</label>
                            <input
                                type="number"
                                id="presencePenalty"
                                name="presencePenalty"
                                value={formData.presencePenalty || ''}
                                onChange={handleInputChange}
                                className={styles.input}
                                min="-2"
                                max="2"
                                step="0.1"
                                required
                            />
                            {validationErrors.presencePenalty && (
                                <span className={styles.error}>{validationErrors.presencePenalty}</span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="temperature">Temperature (0-2)</label>
                            <input
                                type="number"
                                id="temperature"
                                name="temperature"
                                value={formData.temperature || ''}
                                onChange={handleInputChange}
                                className={styles.input}
                                min="0"
                                max="2"
                                step="0.1"
                                required
                            />
                            {validationErrors.temperature && (
                                <span className={styles.error}>{validationErrors.temperature}</span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="topP">Top P (0-1)</label>
                            <input
                                type="number"
                                id="topP"
                                name="topP"
                                value={formData.topP || ''}
                                onChange={handleInputChange}
                                className={styles.input}
                                min="0"
                                max="1"
                                step="0.1"
                                required
                            />
                            {validationErrors.topP && (
                                <span className={styles.error}>{validationErrors.topP}</span>
                            )}
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default EditPlan; 