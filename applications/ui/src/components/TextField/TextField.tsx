import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import {InputLabel, FormHelperText} from '@material-ui/core';
import Input, {InputProps as MuiInputProps} from '@material-ui/core/Input';
import {FieldProps, getIn} from 'formik';
import {Omit} from '../../utils/types';

export interface IInputProps extends FieldProps, Omit<MuiInputProps, 'error' | 'onChange' | 'value'> {}

export interface ITextFieldProps extends IInputProps {
    label: string;
}

export const fieldToTextField = ({field, form, disabled = false, ...props}: IInputProps): MuiInputProps => {
    const {name} = field;
    const {touched, errors, isSubmitting} = form;

    const fieldError = getIn(errors, name);
    const showError = getIn(touched, name) && !!fieldError;

    return {
        ...props,
        ...field,
        error: showError,
        disabled: isSubmitting || disabled
    };
};

export const TextField: React.ComponentType<ITextFieldProps> = ({children, margin, ...props}: ITextFieldProps) => {
    const fieldError = getIn(props.form.errors, props.field.name);
    const showError = getIn(props.form.touched, props.field.name) && !!fieldError;

    return (
        <FormControl error={showError} margin={margin}>
            <InputLabel htmlFor={props.name}>{props.label}</InputLabel>
            <Input {...fieldToTextField(props)} children={children} />
            {showError ? <FormHelperText component="div">{getIn(props.form.errors, props.field.name)}</FormHelperText> : null}
        </FormControl>
    );
};

TextField.displayName = 'FormikMaterialUITextField';
