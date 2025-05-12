import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './PlanDetails.module.css';

interface Plan {
    id: string;
    name: string;
    prompt: string;
}

const PlanDetails: React.FC = () => {
    const { planId } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState<Plan | null>(null);
    const [editPrompt, setEditPrompt] = useState('');

    useEffect(() => {
        // Mock function to fetch plan - replace with actual API call
        const fetchPlan = async () => {
            if (!planId) return;
            
            const mockPlan: Plan = {
                id: planId,
                name: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
                prompt: 'Create a travel itinerary...' // Replace with actual prompt
            };
            setPlan(mockPlan);
            setEditPrompt(mockPlan.prompt);
        };

        fetchPlan();
    }, [planId]);

    const handleSave = async () => {
        if (plan) {
            // Mock save function - replace with actual API call
            console.log(`Saving plan ${plan.id} with prompt: ${editPrompt}`);
            navigate('/');
        }
    };

    return plan ? (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>{plan.name}</h1>
                <div className={styles.actionButtons}>
                    <button className={styles.saveButton} onClick={handleSave}>Save Changes</button>
                    <button className={styles.cancelButton} onClick={() => navigate('/')}>Back to Plans</button>
                </div>
            </div>

            <div className={styles.promptContainer}>
                <textarea
                    className={styles.promptEditor}
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Enter prompt text..."
                    rows={10}
                />
            </div>
        </div>
    ) : null;
};

export default PlanDetails; 