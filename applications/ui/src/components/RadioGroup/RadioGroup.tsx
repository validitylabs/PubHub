import * as React from 'react';
import MuiRadioGroup, {RadioGroupProps as MuiRadioGroupProps} from '@material-ui/core/RadioGroup';
import {FieldProps} from 'formik';

import {Omit} from '../../utils/types';

export interface IRadioGroupProps extends Omit<MuiRadioGroupProps, 'name' | 'onChange' | 'value'>, FieldProps {}

export const fieldToRadioGroup = ({
    field,
    // Exclude Form
    // tslint:disable-next-line:no-unused
    form,
    ...props
}: IRadioGroupProps): MuiRadioGroupProps => ({
    ...props,
    ...field
});

export const RadioGroup: React.ComponentType<IRadioGroupProps> = (props: IRadioGroupProps) => {
    return <MuiRadioGroup {...fieldToRadioGroup(props)} />;
};

RadioGroup.displayName = 'FormikMaterialUIRadioGroup';
