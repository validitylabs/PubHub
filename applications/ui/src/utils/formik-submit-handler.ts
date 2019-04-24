import {FormikValues, FormikActions, FormikErrors} from 'formik';
import {AxiosError} from 'axios';

interface IValidationError<V> {
    /**
     * Object that was validated.
     *
     * OPTIONAL - configurable via the ValidatorOptions.validationError.target option
     */
    target?: Object;
    /**
     * Object's property that haven't pass validation.
     */
    property: keyof V;
    /**
     * Value that haven't pass a validation.
     *
     * OPTIONAL - configurable via the ValidatorOptions.validationError.value option
     */
    value?: any;
    /**
     * Constraints that failed validation with error messages.
     */
    constraints: {
        [type: string]: string;
    };
    /**
     * Contains all nested validation errors of the property.
     */
    children: IValidationError<V>[];
    contexts?: {
        [type: string]: any;
    };
}

const isResponseStatusBadRequest = (error: AxiosError) => Boolean(error.response && error.response.status === 400);
const isResponseStatusForbidden = (error: AxiosError) => Boolean(error.response && error.response.status === 403);

const isValidationError = (error: AxiosError) =>
    Boolean(
        error.response && error.response.status === 400 && error.response.data && error.response.data.error && error.response.data.error === 'Validation error'
    );

const convertErrors = <V>(validationErrors: IValidationError<V>[]): any =>
    validationErrors.reduce<any>((result, validationError) => {
        result[validationError.property] = Object.values(validationError.constraints).join('.\n');
        return result;
    }, {});

export type SubmitFunction<V> = (values: FormikValues, formikActions: FormikActions<V>) => Promise<void> | void;
export type ConvertValidationErrorsFunction<V> = (validationErrors: IValidationError<V>[]) => FormikErrors<V>;
export type ErrorFunction<V, E> = (error: E, values: FormikValues, formikActions: FormikActions<V>) => Promise<void> | void;

export const formikSubmitHandler = <V>(
    submitCallback: SubmitFunction<V>,
    additionalCallbacks?: {
        convertValidationErrors?: ConvertValidationErrorsFunction<V>;
        validationError?: ErrorFunction<V, AxiosError>;
        badRequest?: ErrorFunction<V, AxiosError>;
        forbidden?: ErrorFunction<V, AxiosError>;
        unknownError?: ErrorFunction<V, any>;
    }
) => {
    return async (values: FormikValues, formikActions: FormikActions<V>) => {
        try {
            await submitCallback(values, formikActions);

            formikActions.setSubmitting(false);
        } catch (error) {
            if (isResponseStatusBadRequest(error) && isValidationError(error)) {
                // Bad request and validation error
                console.log('Bad request (Validation error) > error.response.data', error.response.data);
                if (additionalCallbacks && additionalCallbacks.convertValidationErrors) {
                    formikActions.setErrors(additionalCallbacks.convertValidationErrors(error.response.data.message));
                } else {
                    formikActions.setErrors(convertErrors(error.response.data.message));
                }

                if (additionalCallbacks && additionalCallbacks.validationError) {
                    await additionalCallbacks.validationError(error, values, formikActions);
                }
            } else if (isResponseStatusBadRequest(error) && !isValidationError(error)) {
                // Bad request
                console.log('Bad request > error.response.data', error.response.data);
                if (additionalCallbacks && additionalCallbacks.badRequest) {
                    await additionalCallbacks.badRequest(error, values, formikActions);
                }
            } else if (isResponseStatusForbidden(error)) {
                // Forbidden
                console.log('Forbidden > error.response.data', error.response.data);
                if (additionalCallbacks && additionalCallbacks.forbidden) {
                    await additionalCallbacks.forbidden(error, values, formikActions);
                }
            } else if (!isResponseStatusBadRequest(error) && !isResponseStatusForbidden(error) && error.response && error.response.data) {
                // All other request errors
                console.log('Request error > error.response.data', error.response.data);
                console.log('Request error > error.response.status', error.response.status);
                console.log('Request error > error.response.headers', error.response.headers);
                if (additionalCallbacks && additionalCallbacks.unknownError) {
                    await additionalCallbacks.unknownError(error, values, formikActions);
                }
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log('Request error > error.request', error.request);
                if (additionalCallbacks && additionalCallbacks.unknownError) {
                    await additionalCallbacks.unknownError(error, values, formikActions);
                }
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Request error > error.message', error.message);
                if (additionalCallbacks && additionalCallbacks.unknownError) {
                    await additionalCallbacks.unknownError(error, values, formikActions);
                }
            }
            formikActions.setSubmitting(false);
        }
    };
};
