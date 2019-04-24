import React from 'react';
import {Moment} from 'moment';
import moment from 'moment-timezone';
import MomentUtils from '@date-io/moment';
import {withStyles} from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import {MuiPickersUtilsProvider, DateTimePicker, DatePicker, TimePicker} from 'material-ui-pickers';
import {Keyboard, KeyboardArrowLeft, KeyboardArrowRight, DateRange, AccessTime} from '@material-ui/icons';
import FormHelperText from '@material-ui/core/FormHelperText';

import {FieldProps, getIn} from 'formik';

const styles = () => ({
    formControl: {
        width: '100%'
    },
    dateTime: {},
    error: {
        color: '#f44336',
        fontSize: '.75rem'
    }
});

export interface IDateTimeFieldComponentProps {
    field: any;
    form: any;
    classes: {
        formControl: string;
        dateTime: string;
        error: string;
    };
    label: string;
    value?: string;
    meta?: {
        touched: boolean;
        error: any;
    };
    timezone?: any;
    type: string;
    // onError(): void;
    onChange(): void;
}

export const momentToTimeStamp = (date: Moment) => {
    return date.unix();
};

export const timeStampToMoment = (timestamp: number) => {
    // return moment(timestamp);
    // return moment.unix(timestamp); // from local timestamp
    return moment.unix(timestamp).utc(); // from UTC timestamp
};

export const getDateTimeObject = (timestampArg?: number) => {
    const timestamp = timestampArg ? timestampArg * 1000 : Math.floor(new Date().getTime());

    const localMoment = moment(timestamp);
    const utcMoment = moment(timestamp).utc();

    const localTimestamp = localMoment.unix();
    const utcTimestamp = utcMoment.unix();

    const timeZone = moment.tz.guess();
    const zone = moment.tz.zone(timeZone) || null;
    const utcOffset = zone ? zone.utcOffset(localTimestamp) : 0;

    let localAsUtcTimestamp;
    if (utcOffset >= 0) {
        localAsUtcTimestamp = utcTimestamp + utcOffset * 60;
    } else {
        localAsUtcTimestamp = utcTimestamp - utcOffset * 60;
    }

    const formattedLocal = localMoment.format('YYYY-MM-DDTHH:mm');
    const formattedLocalLabel = localMoment.format('YYYY-MM-DD HH:mm');

    const formattedUtc = utcMoment.format('YYYY-MM-DDTHH:mm');
    const formattedUtcLabel = utcMoment.format('YYYY-MM-DD HH:mm'); // 'DD.MM.YYYY HH:mm'

    return {
        converted: {
            localAsUtcTimestamp
        },
        local: {
            timestamp: localTimestamp,
            formatted: formattedLocal,
            formattedLabel: formattedLocalLabel,
            isUTC: localMoment.isUTC(),
            timeZone,
            utcOffset
        },
        utc: {
            timestamp: utcTimestamp,
            formatted: formattedUtc,
            formattedLabel: formattedUtcLabel,
            isUTC: utcMoment.isUTC()
        }
    };
};

// tslint:disable-next-line
const DateTimeField = withStyles(styles)((props: IDateTimeFieldComponentProps) => {
    const {classes, label, value, timezone, type, /*onError,*/ meta, onChange, field, form} = props;
    let valueWithTimeZone = null;

    const {name} = field;
    const {touched, errors, isSubmitting} = form;

    const fieldError = getIn(errors, name);
    const showError = getIn(touched, name) && !!fieldError;

    console.log('===========');
    console.log('>>> form');
    console.log(form);
    console.log('>>> field');
    console.log(field);
    console.log('>>> errors');
    console.log(errors);
    console.log('>>> touched');
    console.log(touched);
    console.log('>>> fieldError');
    console.log(fieldError);
    console.log('>>> showError');
    console.log(showError);
    console.log('===========');

    const dateTimeObject = getDateTimeObject();
    const timeZone = timezone || dateTimeObject.local.timeZone;

    if (value) {
        valueWithTimeZone = moment.tz(value, timeZone);
    }

    console.log('>>> valueWithTimeZone');
    console.log(valueWithTimeZone);

    const keyboardArrowLeft = <KeyboardArrowLeft nativeColor="rgba(0, 0, 0, 0.87)" />;
    const keyboardArrowRight = <KeyboardArrowRight nativeColor="rgba(0, 0, 0, 0.87)" />;
    const dateRange = <DateRange />;
    const accessTime = <AccessTime />;
    const keyboard = <Keyboard />;

    switch (type) {
        // case 'DateTime':
        //     return (
        //         <FormControl className={classes.formControl} error aria-describedby="name-error-text">
        //             <MuiPickersUtilsProvider utils={MomentUtils}>
        //                 <DateTimePicker
        //                     keyboard
        //                     ampm={false}
        //                     className={classes.dateTime}
        //                     keyboardIcon={keyboard}
        //                     placeholder="YYYY/MM/DD hh:mm AM/PM"
        //                     format="YYYY/MM/DD hh:mm A"
        //                     leftArrowIcon={keyboardArrowLeft}
        //                     rightArrowIcon={keyboardArrowRight}
        //                     dateRangeIcon={dateRange}
        //                     timeIcon={accessTime}
        //                     label={label}
        //                     showTodayButton
        //                     error={meta && meta.touched && meta.error && meta.error.length > 0}
        //                     value={valueWithTimeZone}
        //                     onChange={onChange}
        //                     onError={onError}
        //                     mask={(valueWithTimeZone: any) =>
        //                         valueWithTimeZone
        //                             ? [/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/, ' ', /a|p/i, 'M']
        //                             : []
        //                     }
        //                 />
        //             </MuiPickersUtilsProvider>
        //             {meta && meta.touched && meta.error ? (
        //                 <FormHelperText className={classes.error} id="name-error-text">
        //                     {meta.error}
        //                 </FormHelperText>
        //             ) : null}
        //         </FormControl>
        //     );
        case 'Date':
            return (
                <FormControl className={classes.formControl} error aria-describedby="name-error-text">
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                            // name={field.name}
                            keyboard
                            className={classes.dateTime}
                            keyboardIcon={keyboard}
                            placeholder="YYYY/MM/DD"
                            format="YYYY/MM/DD"
                            leftArrowIcon={keyboardArrowLeft}
                            rightArrowIcon={keyboardArrowRight}
                            label={label}
                            showTodayButton
                            error={meta && meta.touched && meta.error && meta.error.length > 0}
                            value={valueWithTimeZone}
                            onChange={onChange}
                            // onError={showError}
                            mask={(valueWithTimeZone: any) => (valueWithTimeZone ? [/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/] : [])}
                        />
                    </MuiPickersUtilsProvider>
                    {fieldError ? (
                        <FormHelperText className={classes.error} id="name-error-text">
                            HELPER: {fieldError}
                        </FormHelperText>
                    ) : null}
                </FormControl>
            );
        // case 'Time':
        //     return (
        //         <FormControl className={classes.formControl} error aria-describedby="name-error-text">
        //             <MuiPickersUtilsProvider utils={MomentUtils}>
        //                 <TimePicker
        //                     keyboard
        //                     ampm={false}
        //                     className={classes.dateTime}
        //                     keyboardIcon={keyboard}
        //                     placeholder="hh:mm A"
        //                     format="hh:mm A"
        //                     label={label}
        //                     showTodayButton
        //                     error={meta && meta.touched && meta.error && meta.error.length > 0}
        //                     value={valueWithTimeZone}
        //                     onChange={onChange}
        //                     onError={onError}
        //                     mask={(valueWithTimeZone: any) => (valueWithTimeZone ? [/\d/, /\d/, ':', /\d/, /\d/, ' ', /a|p/i, 'M'] : [])}
        //                 />
        //             </MuiPickersUtilsProvider>
        //             {meta && meta.touched && meta.error ? (
        //                 <FormHelperText className={classes.error} id="name-error-text">
        //                     {meta.error}
        //                 </FormHelperText>
        //             ) : null}
        //         </FormControl>
        //     );
        default:
            throw new Error('Invalid type detected');
    }
});

export {DateTimeField};
