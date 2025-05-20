import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlay, FaEye } from 'react-icons/fa';
import styles from './PlanChange.module.css';
import type { Plan } from '../../services/plansService';
import { getPlans, deletePlan } from '../../services/plansService';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    planName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, planName }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Delete Plan</h2>
                <p>Are you sure you want to delete "{planName}"?</p>
                <p className={styles.warningText}>This action cannot be undone.</p>
                <div className={styles.modalButtons}>
                    <button
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className={styles.deleteConfirmButton}
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const PlanChange: React.FC = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [hoveredDelete, setHoveredDelete] = useState<number | null>(null);
    const [hoveredTest, setHoveredTest] = useState<number | null>(null);
    const [hoveredPreview, setHoveredPreview] = useState<number | null>(null);
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        planId: number | null;
        planName: string;
    }>({
        isOpen: false,
        planId: null,
        planName: ''
    });

    const fetchPlans = () => {
        setIsLoading(true);
        getPlans().then(response => {
            setPlans(response.prompts);
        })
            .catch(error => {
                console.error('Error fetching plans:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
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

    const handleTestPlan = (e: React.MouseEvent, planId: number) => {
        e.stopPropagation(); // Prevent row click event
        navigate(`/test/${planId}`);
    };

    const handlePreviewPlan = (e: React.MouseEvent, planId: number) => {
        e.stopPropagation(); // Prevent row click event
        navigate(`/preview/${planId}`);
    };

    const handleDelete = (e: React.MouseEvent, planId: number, planName: string) => {
        e.stopPropagation(); // Prevent row click event
        setDeleteModal({
            isOpen: true,
            planId,
            planName
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.planId) return;

        try {
            await deletePlan(deleteModal.planId);
            fetchPlans();
        } catch (error) {
            console.error('Error deleting plan:', error);
            // TODO: Show error message to user
        } finally {
            setDeleteModal({
                isOpen: false,
                planId: null,
                planName: ''
            });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({
            isOpen: false,
            planId: null,
            planName: ''
        });
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

            {isLoading ? (
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
            ) : (
                <table className={styles.plansTable}>
                    <tbody>
                        {plans?.map(plan => (
                            <tr
                                key={plan.id}
                                onClick={() => handlePlanClick(plan.id)}
                                className={styles.clickableRow}
                                onMouseEnter={() => setHoveredRow(plan.id)}
                                onMouseLeave={() => {
                                    setHoveredRow(null);
                                    setHoveredDelete(null);
                                    setHoveredTest(null);
                                    setHoveredPreview(null);
                                }}
                                style={{
                                    backgroundColor: hoveredRow === plan.id && 
                                        hoveredDelete !== plan.id && 
                                        hoveredTest !== plan.id && 
                                        hoveredPreview !== plan.id ? '#404040' : 'transparent'
                                }}
                            >
                                <td>{plan.planName}</td>
                                <td className={styles.actionCell}>
                                    <button
                                        className={styles.previewButton}
                                        onClick={(e) => handlePreviewPlan(e, plan.id)}
                                        onMouseEnter={() => setHoveredPreview(plan.id)}
                                        onMouseLeave={() => setHoveredPreview(null)}
                                        style={{
                                            backgroundColor: hoveredPreview === plan.id ? '#404040' : 'transparent'
                                        }}
                                        title="Preview Plan"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        className={styles.testButton}
                                        onClick={(e) => handleTestPlan(e, plan.id)}
                                        onMouseEnter={() => setHoveredTest(plan.id)}
                                        onMouseLeave={() => setHoveredTest(null)}
                                        style={{
                                            backgroundColor: hoveredTest === plan.id ? '#404040' : 'transparent'
                                        }}
                                    >
                                        <FaPlay />
                                    </button>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={(e) => handleDelete(e, plan.id, plan.planName)}
                                        onMouseEnter={() => setHoveredDelete(plan.id)}
                                        onMouseLeave={() => setHoveredDelete(null)}
                                        style={{
                                            backgroundColor: hoveredDelete === plan.id ? '#404040' : 'transparent'
                                        }}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                planName={deleteModal.planName}
            />
        </div>
    );
};

export default PlanChange;