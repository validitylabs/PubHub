import * as React from 'react';
import {FieldProps, getIn} from 'formik';
import MuiSelect, {SelectProps as MuiSelectProps} from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import {Omit} from '../../utils/types';

export interface ISelectProps extends FieldProps, Omit<MuiSelectProps, 'value'> {}

export interface IExtendedSelectProps extends ISelectProps {
    label: string;
    err?: string;
}

export const fieldToSelect = ({field, form, disabled = false, ...props}: ISelectProps): MuiSelectProps => {
    const {name} = field;
    const {touched, errors, isSubmitting} = form;

    const fieldError = getIn(errors, name);
    const showError = getIn(touched, name) && !!fieldError;

    return {
        ...props,
        ...field,
        disabled: isSubmitting || disabled,
        error: showError
    };
};

export const Select: React.ComponentType<IExtendedSelectProps> = (props: IExtendedSelectProps) => {
    const fieldError = getIn(props.form.errors, props.field.name);
    const showError = getIn(props.form.touched, props.field.name) && !!fieldError;

    return (
        <FormControl error={showError}>
            <InputLabel htmlFor={props.name}>{props.label}</InputLabel>
            <MuiSelect style={{marginTop: '16px'}} {...fieldToSelect(props)} />
            {showError ? <FormHelperText>{getIn(props.form.errors, props.field.name)}</FormHelperText> : null}
        </FormControl>
    );
};

Select.displayName = 'FormikMaterialUISelect';
