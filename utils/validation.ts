import { useState } from 'react';

export interface ValidationRule<T> {
    validate: (value: T) => boolean;
    message: string;
}

export type ValidationSchema<T> = {
    [K in keyof T]?: ValidationRule<T[K]>[];
};

export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

export class FormValidator {
    // Common validation rules
    static required<T>(message: string = 'This field is required'): ValidationRule<T> {
        return {
            validate: (value: T) => {
                if (typeof value === 'string') return value.trim().length > 0;
                if (Array.isArray(value)) return value.length > 0;
                if (typeof value === 'boolean') return value === true;
                return value !== null && value !== undefined;
            },
            message
        };
    }

    static email(message: string = 'Please enter a valid email address'): ValidationRule<string> {
        return {
            validate: (value: string) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value.trim());
            },
            message
        };
    }

    static minLength(length: number, message?: string): ValidationRule<string> {
        return {
            validate: (value: string) => value.trim().length >= length,
            message: message || `Must be at least ${length} characters long`
        };
    }

    static maxLength(length: number, message?: string): ValidationRule<string> {
        return {
            validate: (value: string) => value.trim().length <= length,
            message: message || `Must be no more than ${length} characters long`
        };
    }

    static minAge(age: number, message?: string): ValidationRule<number> {
        return {
            validate: (value: number) => value >= age,
            message: message || `Must be at least ${age} years old`
        };
    }

    static maxAge(age: number, message?: string): ValidationRule<number> {
        return {
            validate: (value: number) => value <= age,
            message: message || `Must be no more than ${age} years old`
        };
    }

    static phoneNumber(message: string = 'Please enter a valid phone number'): ValidationRule<string> {
        return {
            validate: (value: string) => {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
            },
            message
        };
    }

    static passwordStrength(message?: string): ValidationRule<string> {
        return {
            validate: (value: string) => {
                // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
                const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
                return strongRegex.test(value);
            },
            message: message || 'Password must be at least 8 characters with uppercase, lowercase, and number'
        };
    }

    static matchField<T>(otherValue: T, fieldName: string): ValidationRule<T> {
        return {
            validate: (value: T) => value === otherValue,
            message: `Must match ${fieldName}`
        };
    }

    static arrayMinLength<T>(length: number, message?: string): ValidationRule<T[]> {
        return {
            validate: (value: T[]) => value.length >= length,
            message: message || `Please select at least ${length} item${length > 1 ? 's' : ''}`
        };
    }

    // Validate single field
    static validateField<T>(value: T, rules: ValidationRule<T>[]): string | null {
        for (const rule of rules) {
            if (!rule.validate(value)) {
                return rule.message;
            }
        }
        return null;
    }

    // Validate entire form
    static validateForm<T extends Record<string, any>>(data: T, schema: ValidationSchema<T>): ValidationResult {
        const errors: Record<string, string> = {};
        let isValid = true;

        for (const field in schema) {
            if (schema.hasOwnProperty(field)) {
                const rules = schema[field];
                if (rules && field in data) {
                    const fieldValue = data[field];
                    const error = this.validateField(fieldValue, rules as ValidationRule<any>[]);
                    if (error) {
                        errors[field] = error;
                        isValid = false;
                    }
                }
            }
        }

        return { isValid, errors };
    }
}

// Pre-defined validation schemas for common forms
export const registrationSchema: ValidationSchema<{
    ownerName: string;
    email: string;
    password: string;
    confirmPassword: string;
    location: string;
    phoneNumber: string;
    agreeToTerms: boolean;
}> = {
    ownerName: [
        FormValidator.required('Name is required'),
        FormValidator.minLength(2, 'Name must be at least 2 characters')
    ],
    email: [
        FormValidator.required('Email is required'),
        FormValidator.email()
    ],
    password: [
        FormValidator.required('Password is required'),
        FormValidator.passwordStrength()
    ],
    location: [
        FormValidator.required('Location is required')
    ],
    phoneNumber: [
        FormValidator.required('Phone number is required'),
        FormValidator.phoneNumber()
    ],
    agreeToTerms: [
        FormValidator.required('You must agree to the terms and conditions')
    ]
};

export const dogProfileSchema: ValidationSchema<{
    name: string;
    breed: string;
    sex: 'male' | 'female';
    age: number;
    size: 'small' | 'medium' | 'large';
    color: string;
    temperament: string[];
    description: string;
}> = {
    name: [
        FormValidator.required('Dog name is required'),
        FormValidator.minLength(2, 'Name must be at least 2 characters')
    ],
    breed: [
        FormValidator.required('Breed is required')
    ],
    age: [
        FormValidator.minAge(0.5, 'Age must be at least 6 months'),
        FormValidator.maxAge(15, 'Please verify age for dogs over 15 years')
    ],
    color: [
        FormValidator.required('Color is required')
    ],
    temperament: [
        FormValidator.arrayMinLength(1, 'Please select at least one temperament trait')
    ],
    description: [
        FormValidator.required('Description is required'),
        FormValidator.minLength(20, 'Please provide at least 20 characters'),
        FormValidator.maxLength(500, 'Description must be under 500 characters')
    ]
};

// Real-time validation hook
export function useFormValidation<T extends Record<string, any>>(
    initialData: T,
    schema: ValidationSchema<T>
) {
    const [data, setData] = useState<T>(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const validateField = (field: keyof T, value: any) => {
        const rules = schema[field];
        if (rules) {
            const error = FormValidator.validateField(value, rules as ValidationRule<any>[]);
            setErrors(prev => ({
                ...prev,
                [field as string]: error || ''
            }));
            return error === null;
        }
        return true;
    };

    const setFieldValue = (field: keyof T, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
        if (touched[field as string]) {
            validateField(field, value);
        }
    };

    const setFieldTouched = (field: keyof T) => {
        setTouched(prev => ({ ...prev, [field as string]: true }));
        validateField(field, data[field]);
    };

    const validateForm = () => {
        const result = FormValidator.validateForm(data, schema);
        setErrors(result.errors);

        // Mark all fields as touched
        const allTouched: Record<string, boolean> = {};
        Object.keys(schema).forEach(key => {
            allTouched[key] = true;
        });
        setTouched(allTouched);

        return result;
    };

    const resetForm = () => {
        setData(initialData);
        setErrors({});
        setTouched({});
    };

    return {
        data,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
        validateForm,
        resetForm,
        isFieldValid: (field: keyof T) => !errors[field as string] || !touched[field as string]
    };
}