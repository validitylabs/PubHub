import * as React from 'react';
import MuiCheckbox, {CheckboxProps as MuiCheckboxProps} from '@material-ui/core/Checkbox';
import {FieldProps} from 'formik';
import {Omit} from '../../utils/types';

export interface ICheckboxProps extends FieldProps, Omit<MuiCheckboxProps, 'form' | 'checked' | 'defaultChecked' | 'name' | 'onChange' | 'value'> {}

export const fieldToCheckbox = ({field, form: {isSubmitting}, disabled = false, ...props}: ICheckboxProps): MuiCheckboxProps => {
    return {
        disabled: isSubmitting || disabled,
        ...props,
        ...field,
        // TODO handle indeterminate
        checked: field.value ? 'checked' : '',
        value: field.value ? 'checked' : ''
    };
};

export const Checkbox: React.ComponentType<ICheckboxProps> = (props: ICheckboxProps) => <MuiCheckbox {...fieldToCheckbox(props)} />;

Checkbox.displayName = 'FormikMaterialUICheckbox';
