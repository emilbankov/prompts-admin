export const validateMaxCompletionTokens = (value: number): boolean => {
    return value >= 0;
};

export const validateFrequencyPenalty = (value: number): boolean => {
    return value >= -2 && value <= 2;
};

export const validatePresencePenalty = (value: number): boolean => {
    return value >= -2 && value <= 2;
};

export const validateTemperature = (value: number): boolean => {
    return value >= 0 && value <= 2;
};

export const validateTopP = (value: number): boolean => {
    return value >= 0 && value <= 1;
};

export const getFieldValidationMessage = (field: string, value: number): string => {
    switch (field) {
        case 'maxCompletionTokens':
            return validateMaxCompletionTokens(value) ? '' : 'Max completion tokens must be a non-negative number';
        case 'frequencyPenalty':
            return validateFrequencyPenalty(value) ? '' : 'Frequency penalty must be between -2 and 2';
        case 'presencePenalty':
            return validatePresencePenalty(value) ? '' : 'Presence penalty must be between -2 and 2';
        case 'temperature':
            return validateTemperature(value) ? '' : 'Temperature must be between 0 and 2';
        case 'topP':
            return validateTopP(value) ? '' : 'Top P must be between 0 and 1';
        default:
            return '';
    }
}; 