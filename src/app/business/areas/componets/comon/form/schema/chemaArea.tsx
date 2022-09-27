import * as yup from 'yup';

export const schemaForm = yup.object({
    name_area: yup
        .string()
        .typeError('El nombre no es correcto.')
        .min(3, 'El nombre debe tener al menos 3 caracteres.')
        .required('El nombre es requerido.'),
    price_area: yup
        .number()
        .typeError('El precio no es correcto.')
        .min(1, 'El precio debe ser mayor que 0.'),
    time_area: yup
        .number()
        .typeError('El tiempo no es correcto. El formato es segundos.')
        .min(1, 'El tiempo tiene que ser mayor que 0. El formato es segundos.'),
});
