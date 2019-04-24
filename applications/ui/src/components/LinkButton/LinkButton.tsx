import React, {FunctionComponent} from 'react';
import {Link as RouterLink, LinkProps as RouterLinkProps} from 'react-router-dom';
import MUILink, {LinkProps as MUILinkProps} from '@material-ui/core/Link';
import MUIButton, {ButtonProps as MUIButtonProps} from '@material-ui/core/Button';

export interface ILinkButtonProps {
    children: React.ReactNode;
}

export const LinkButton: FunctionComponent<ILinkButtonProps & MUILinkProps & MUIButtonProps & RouterLinkProps> = ({to, children, color, ...rest}) => {
    return (
        <MUILink
            {...rest}
            underline="none"
            component={({innerRef, ...restOfMUILink}) => (
                <RouterLink to={to} innerRef={innerRef as (node: HTMLAnchorElement | null) => void} {...restOfMUILink} />
            )}
        >
            <MUIButton color={color}>{children}</MUIButton>
        </MUILink>
    );
};
