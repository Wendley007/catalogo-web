import { useState, useCallback } from "react";

/**
 * Hook customizado para gerenciar formulários
 * @param {Object} initialValues - Valores iniciais do formulário
 * @param {Function} onSubmit - Função de submit do formulário
 * @param {Function} validate - Função de validação (opcional)
 */
export const useForm = (initialValues = {}, onSubmit, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  /**
   * Atualiza um campo do formulário
   */
  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Remove erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [errors]);

  /**
   * Manipula mudanças nos inputs
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setValue(name, fieldValue);
  }, [setValue]);

  /**
   * Manipula blur nos inputs
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Valida o campo quando perde o foco
    if (validate) {
      const fieldErrors = validate({ [name]: values[name] });
      if (fieldErrors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: fieldErrors[name]
        }));
      }
    }
  }, [values, validate]);

  /**
   * Valida todos os campos
   */
  const validateForm = useCallback(() => {
    if (!validate) return true;
    
    const formErrors = validate(values);
    setErrors(formErrors);
    
    return Object.keys(formErrors).length === 0;
  }, [values, validate]);

  /**
   * Manipula submit do formulário
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Marca todos os campos como touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Valida o formulário
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Erro no submit do formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, isSubmitting, validateForm, onSubmit]);

  /**
   * Reset do formulário
   */
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Verifica se um campo tem erro e foi touched
   */
  const getFieldError = useCallback((name) => {
    return touched[name] && errors[name];
  }, [touched, errors]);

  /**
   * Verifica se o formulário é válido
   */
  const isValid = Object.keys(errors).length === 0;

  /**
   * Verifica se o formulário foi modificado
   */
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    setValue,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    getFieldError,
    validateForm
  };
};