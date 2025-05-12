import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditPlan.module.css';
import type { Plan } from '../../services/plansService';

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

const EditPlan: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Plan>({
        id: undefined as unknown as number,
        planName: '',
        systemPrompt: '',
        systemVariables: '',
        userPrompt: '',
        userVariables: '',
        model: 'gpt-4.1',
        reasoningEffort: 'medium'
    });
    const [copiedVar, setCopiedVar] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['maxCompletionTokens', 'frequencyPenalty', 'presencePenalty', 'temperature', 'topP'].includes(name)
                ? value === '' ? undefined : Number(value)
                : value
        }));
    };

    const handleSave = async () => {
        // TODO: Implement API call to save plan
        console.log('Saving plan:', formData);
        navigate('/');
    };

    const handleCopyVariable = (variable: string) => {
        navigator.clipboard.writeText(`{${variable}}`);
        setCopiedVar(variable);
        setTimeout(() => setCopiedVar(null), 2000);
    };

    const isOModel = formData.model.startsWith('o');
    const systemVariables = formData.systemVariables.split(',').map(v => v.trim()).filter(Boolean);
    const userVariables = formData.userVariables.split(',').map(v => v.trim()).filter(Boolean);

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
                    />
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
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="systemVariables">System Prompt Variables (comma-separated)</label>
                    <input
                        type="text"
                        id="systemVariables"
                        name="systemVariables"
                        value={formData.systemVariables}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="e.g., role, expertise"
                    />
                </div>

                <div className={styles.variablesContainer}>
                    <h3>System Prompt Variables</h3>
                    <div className={styles.variablesList}>
                        {systemVariables.map(variable => (
                            <button
                                key={variable}
                                type="button"
                                onClick={() => handleCopyVariable(variable)}
                                className={`${styles.variableButton} ${copiedVar === variable ? styles.copied : ''}`}
                            >
                                {variable}
                                {copiedVar === variable && <span className={styles.copyIndicator}>✓</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="userVariables">User Prompt Variables (comma-separated)</label>
                    <input
                        type="text"
                        id="userVariables"
                        name="userVariables"
                        value={formData.userVariables}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="e.g., location, duration, preferences"
                    />
                </div>

                <div className={styles.variablesContainer}>
                    <h3>User Prompt Variables</h3>
                    <div className={styles.variablesList}>
                        {userVariables.map(variable => (
                            <button
                                key={variable}
                                type="button"
                                onClick={() => handleCopyVariable(variable)}
                                className={`${styles.variableButton} ${copiedVar === variable ? styles.copied : ''}`}
                            >
                                {variable}
                                {copiedVar === variable && <span className={styles.copyIndicator}>✓</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="userPrompt">User Prompt</label>
                    <textarea
                        id="userPrompt"
                        name="userPrompt"
                        value={formData.userPrompt}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        rows={4}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="model">AI Model</label>
                    <select
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        className={styles.select}
                    >
                        {AI_MODELS.map(model => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
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
                        min="1"
                    />
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
                        >
                            {REASONING_EFFORT_OPTIONS.map(option => (
                                <option key={option} value={option}>
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </option>
                            ))}
                        </select>
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
                            />
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
                            />
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
                            />
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
                            />
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default EditPlan; 