import axios from 'axios';

const BASE_URL = 'http://localhost:8080/prompts';

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

export type CreatePlanData = Omit<Plan, 'id'>;

export const getPlanById = async (id: number): Promise<Plan> => {
    try {
        const { data } = await axios.get<Plan>(`${BASE_URL}/${id}`);
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
