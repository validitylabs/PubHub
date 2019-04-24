import * as React from 'react';
import MuiCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel, {FormControlLabelProps as MuiFormControlLabelProps} from '@material-ui/core/FormControlLabel';

import {ICheckboxProps, fieldToCheckbox} from '../Checkbox';
import {Omit} from '../../utils/types';

/**
 * Exclude props that are passed directly to the control
 * https://github.com/mui-org/material-ui/blob/v3.1.1/packages/material-ui/src/FormControlLabel/FormControlLabel.js#L71
 */
export interface ICheckboxWithLabelProps extends ICheckboxProps {
    Label: Omit<MuiFormControlLabelProps, 'checked' | 'name' | 'onChange' | 'value' | 'inputRef'>;
}

export const CheckboxWithLabel: React.ComponentType<ICheckboxWithLabelProps> = ({Label, ...props}) => (
    <FormControlLabel style={{userSelect: 'none'}} control={<MuiCheckbox {...fieldToCheckbox(props)} />} label={Label} />
);

CheckboxWithLabel.displayName = 'FormikMaterialUICheckboxWithLabel';
