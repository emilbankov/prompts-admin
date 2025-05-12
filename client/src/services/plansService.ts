import axios from 'axios';

const BASE_URL = 'https://aitrip-production.up.railway.app/prompts';

export interface Plan {
    id: number;
    name: string;
    systemPrompt: string;
    systemVariables: string;
    userPrompt: string;
    userVariables: string;
    model: string;
    maxCompletionTokens?: number;
    reasoningEffort?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    temperature?: number;
    topP?: number;
}

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
