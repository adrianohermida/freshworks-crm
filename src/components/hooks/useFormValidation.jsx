import { useState, useCallback } from 'react';

/**
 * Hook: Validação de Formulários
 * Validação em tempo real com feedback visual
 */
export function useFormValidation(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = useCallback((fieldName, fieldValue) => {
    const rule = validationRules[fieldName];
    if (!rule) return null;

    if (rule.required && !fieldValue?.trim()) {
      return `${rule.label || fieldName} é obrigatório`;
    }

    if (rule.email && fieldValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)) {
      return 'Email inválido';
    }

    if (rule.minLength && fieldValue?.length < rule.minLength) {
      return `Mínimo ${rule.minLength} caracteres`;
    }

    if (rule.maxLength && fieldValue?.length > rule.maxLength) {
      return `Máximo ${rule.maxLength} caracteres`;
    }

    if (rule.pattern && !rule.pattern.test(fieldValue)) {
      return rule.message || 'Formato inválido';
    }

    return null;
  }, [validationRules]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validar em tempo real se campo foi tocado
    if (touched[name]) {
      const error = validate(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [touched, validate]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validate(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [validate]);

  const isValid = Object.values(errors).every(err => !err);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isValid,
    reset,
    setValues,
    setErrors
  };
}