import * as React from 'react';
import MuiSwitch, {SwitchProps as MuiSwitchProps} from '@material-ui/core/Switch';
import {FieldProps} from 'formik';
import {Omit} from '../../utils/types';

export interface ISwitchProps extends FieldProps, Omit<MuiSwitchProps, 'form' | 'name' | 'onChange' | 'value' | 'defaultChecked'> {}

export const fieldToSwitch = ({field, form: {isSubmitting}, disabled = false, ...props}: ISwitchProps): MuiSwitchProps => {
    return {
        disabled: isSubmitting || disabled,
        ...props,
        ...field,
        value: field.name,
        checked: field.value
    };
};

export const Switch: React.ComponentType<ISwitchProps> = (props: ISwitchProps) => <MuiSwitch {...fieldToSwitch(props)} />;

Switch.displayName = 'FormikMaterialUISwitch';
