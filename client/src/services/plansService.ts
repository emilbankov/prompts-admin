import axios from 'axios';

const BASE_URL = 'https://religious-josy-boklucite-a0b493a9.koyeb.app/prompts';

export interface Plan {
    id: number;
    planName: string;
    systemPrompt: string;
    systemVariables: string;
    userPrompt: string;
    userVariables: string;
    model: string;
    maxCompletionTokens?: number;
    reasoningEffort?: string;
    frequencyPenalty?: number;
    presencePenalty?: number;
    temperature?: number;
    topP?: number;
}

export interface PlanResponse {
    message: string;
    prompt: Plan;
}

export interface PlansResponse {
    message: string;
    prompts: Plan[];
}

export type CreatePlanData = Omit<Plan, 'id' | 'systemVariables' | 'userVariables'>;

export const getPlans = async (): Promise<PlansResponse> => {
    try {
        const { data } = await axios.get<PlansResponse>(BASE_URL);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching plans:', error.response?.data || error.message);
        } else {
            console.error('Error fetching plans:', error);
        }
        throw error;
    }
};

export const getPlanById = async (id: number): Promise<PlanResponse> => {
    try {
        const { data } = await axios.get<PlanResponse>(`${BASE_URL}/${id}`);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching plan:', error.response?.data || error.message);
        } else {
            console.error('Error fetching plan:', error);
        }
        throw error;
    }
};

export const createPlan = async (planData: CreatePlanData): Promise<Plan> => {
    try {
        const { data } = await axios.post<Plan>(`${BASE_URL}/create`, planData);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating plan:', error.response?.data || error.message);
        } else {
            console.error('Error creating plan:', error);
        }
        throw error;
    }
};

export const updatePlan = async (id: number, planData: CreatePlanData): Promise<Plan> => {
    try {
        const { data } = await axios.put<Plan>(`${BASE_URL}/${id}`, planData);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating plan:', error.response?.data || error.message);
        } else {
            console.error('Error updating plan:', error);
        }
        throw error;
    }
};

export const deletePlan = async (planId: number): Promise<void> => {
    try {
        await axios.delete(`${BASE_URL}/${planId}`);
    } catch (error) {
        console.error('Error deleting plan:', error);
        throw error;
    }
};
