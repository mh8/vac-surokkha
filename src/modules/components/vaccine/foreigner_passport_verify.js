import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import moment from 'moment';
import DatePicker from "react-datepicker";
import { birthDays, birthMonths, birthYears,birthYears_birth_reg } from '../../../../data/enroll';
import { birthDays_en, birthMonths_en, birthYears_en,birthYears_birth_reg_en } from '../../../../data/enroll_en';
import { NIDValidator } from '../../../../utils/form/custom_validator';
// import ClientCaptcha from "react-client-captcha";
// import ReCAPTCHA from "react-google-recaptcha";
// import { CAPTCHA_SITE_KEY } from './../../config/constant';
import { CaptchaEn } from '../../../../utils/captcha/captcha_en';
import { useTranslation } from 'react-i18next';
import { getLanguage } from "../../../../utils/common/translation";
import CountdownTimer from "../../../../utils/common/countdownTimer";


const ForeignerPassportVerify = (props) => {

    const [t] = useTranslation();
    const [disableOtpSentButton, setDisableOtpSentButton] = useState(true);
    const [FormLoading, setFormLoading] = useState(false);
    const [FormLoadingTwo, setFormLoadingTwo] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpMsg, setotpMsg] = useState(false);
    const [disableResend, setDisableResend] = useState(true);
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [otp, setOtp] = useState(false);
    const [passport_no, setPassport_no] = useState(false);
    const [birthDate, setBirthDate] = useState(0);
    const [errorMsg, setErrorMsg] = useState(false);
    const [showCaptcha, setShowCaptcha] = useState(true);
    const { register, handleSubmit, errors, setValue } = useForm();
    const captchaRef = useRef();
    const language = getLanguage();

    const onChangePassportHandler = (e) => {
        setPassport_no(e.target.value);
        //captchaRef.current.refresh()
    }

    const onOTPChangeHandler = (e) => {
        setOtp(e.target.value);
    }

    // useEffect(() => {
    //     setValue('date_of_birth', birthDate);
    // }, [birthDate]);

    React.useEffect(() => {
        // register("date_of_birth", {required: true});
        register("captcha_token", {
            required: true
        });
    }, [register])

    const onCapthaChangeHandler = (value) => {
        setValue('captcha_token', value);
        if (value) {
            setDisableOtpSentButton(false);
        } else {
            setDisableOtpSentButton(true);
        }
    }

    const onOTPSent = (data) => {
        // console.log(data);
        const postData = {
            passport_no: passport_no,
            dob: `${data.dob_month}/${data.dob_day}/${data.dob_year}` //moment(data.date_of_birth).format('MM/DD/YYYY')
        }
        setBirthDate(`${data.dob_month}/${data.dob_day}/${data.dob_year}`)
        setDisableOtpSentButton(true);
        setFormLoading(true);
        props.apiService(postData)
            .then((response) => {
                props.apiServiceHandler(response);
                if (response.response.result) {
                    var msg = response.response.message;
                    if (language === "en") {
                        msg = response.response.message_en;
                    }

                    setShowCaptcha(false);
                    setOtpSent(true);
                    setotpMsg(msg);
                    setErrorMsg(false);
                    props.setDisableLeftNavMenu(true)
                } else {
                    var msg = response.response.message;
                    if (language === "en") {
                        msg = response.response.message_en;
                    }

                    setShowCaptcha(true);
                    setOtpSent(false);
                    setDisableOtpSentButton(false);
                    setErrorMsg(msg);
                    captchaRef.current.refresh()
                }
                setFormLoading(false);
            })
            .catch(() => {
                setOtpSent(false);
                var msg = "এই মুহূর্তে কাজটি সম্পন্ন করা সম্ভব হচ্ছেনা। কিছুক্ষণ পর আবার চেষ্টা করুন।";
                if (language === "en") {
                msg = "Request couldn't be processed! Please try again later.";
                }

                setErrorMsg(msg);
                props.apiServiceHandler(false);
                captchaRef.current.refresh()
                setFormLoading(false);
            });

    }

    const onOTPReSend = (data) => {
        // console.log(data);
        const postData = {
            passport_no: passport_no,
            // dob: `${data.dob_month}/${data.dob_day}/${data.dob_year}`,  // moment(birthDate).format('MM/DD/YYYY')
            dob: birthDate,  // moment(birthDate).format('MM/DD/YYYY')
        }
        setDisableOtpSentButton(true);
        setDisableResend(true);
        props.apiService(postData)
            .then((response) => {
                props.apiServiceHandler(response);
                if (response.response.result) {
                    var msg = response.response.message;
                    if (language === "en") {
                        msg = response.response.message_en;
                    }

                    setShowCaptcha(false);
                    setOtpSent(true);
                    setotpMsg(msg);
                    setErrorMsg(false);
                } else {
                    var msg = response.response.message;
                    if (language === "en") {
                        msg = response.response.message_en;
                    }

                    setDisableResend(false);
                    setShowCaptcha(true);
                    setOtpSent(false);
                    setDisableOtpSentButton(false);
                    setErrorMsg(msg);
                    setDisableOtpSentButton(false);
                }
            })
            .catch(() => {
                setOtpSent(false);
                var msg = "এই মুহূর্তে কাজটি সম্পন্ন করা সম্ভব হচ্ছেনা। কিছুক্ষণ পর আবার চেষ্টা করুন।";
                if (language === "en") {
                    msg = "Request couldn't be processed! Please try again later.";
                }

                setDisableResend(false);
                setErrorMsg(msg);
                setDisableOtpSentButton(false);
                props.apiServiceHandler(false);
            });

    }


    const verifyOtp = (data) => {
        const postData = {
            passport_no: passport_no,
            dob: `${data.dob_month}/${data.dob_day}/${data.dob_year}`,  // moment(data.date_of_birth).format('MM/DD/YYYY'),
            otp: otp
        }
        setBirthDate(`${data.dob_month}/${data.dob_day}/${data.dob_year}`)
        setOtpVerifying(true);
        setFormLoadingTwo(true)
        props.apiService(postData)
            .then((response) => {
                if (response) {
                    if (!response.response.result) {
                        setOtpVerifying(false);
                    }
                }
                props.apiServiceHandlerFinal(response);
                setFormLoadingTwo(false)
            })
            .catch(() => {
                setDisableOtpSentButton(false);
                setOtpVerifying(false);
                props.apiServiceHandlerFinal(false);
                setFormLoadingTwo(false)
            });
    }

    return (
        <>
            <div className="su-reg-status-area no-print">

                <div className="su-reg-status-form">

                    <div className="container mob-p-0">
                        {errorMsg &&
                            <div className="row px-lg-10 mt-3">
                                <div className="col-md-12 mb-4">
                                    <div className="alert alert-danger">{errorMsg}</div>
                                </div>
                            </div>
                        }

                        <div id="su-reg-status-form">
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <label htmlFor="passport_no">Passport Number</label>
                                    <input
                                        type="text"
                                        onChange={onChangePassportHandler}
                                        ref={register({
                                            required: true,
                                            maxLength: 10,
                                        })}
                                        name="passport_no"
                                        style={{ textTransform: 'uppercase' }}
                                        className="form-control"
                                        placeholder="AC0215425"
                                        autoComplete="off"
                                        id="passport_no"
                                    />
                                    {errors.passport_no &&
                                        <div className="su-alert-phone">Invalid Passport Number</div>}
                                </div>

                                <div className="col-md-6 mb-4">
                                    <label htmlFor="su-v-dob">Date of birth (according to passport):</label>
                                    {/* <DatePicker
                                        selected={birthDate}
                                        onSelect={setBirthDate}
                                        maxDate={new Date()}
                                        dateFormat={'dd/MM/yyyy'}
                                        showMonthDropdown={true}
                                        showYearDropdown={true}
                                        scrollableYearDropdown={true}
                                        yearDropdownItemNumber={80}
                                        className="form-control"
                                        placeholderText={t('form.placeholder.datepicker')}/> */}
                                    <div className="row">

                                        <div className="col-6 col-md-3 mob-mb-15">
                                            <select
                                                name="dob_day"
                                                ref={register({ required: true })}
                                                className="form-control suk-select-field day"
                                                id="basic_dob_day"
                                                tabIndex="-1"
                                                aria-hidden="true">
                                                <option value="" key={`basic-dob-day-null`}>Day</option>
                                                {birthDays_en.map((type, index) => {
                                                    return <option value={type.value} key={`dob-day-key-${index}`}>{type.title}</option>;
                                                })}
                                            </select>
                                        </div>

                                        <div className="col-md-5 col-6 mob-mb-15">
                                            <select
                                                name="dob_month"
                                                ref={register({ required: true })}
                                                className="form-control suk-select-field"
                                                id="basic_dob_month"
                                                tabIndex="-1"
                                                aria-hidden="true">
                                                <option value="" key={`basic-dob-month-null`}>Month</option>
                                                {birthMonths_en.map((type, index) => {
                                                    return <option value={type.value} key={`dob-month-key-${index}`}>{type.title}</option>;
                                                })}
                                            </select>
                                        </div>

                                        <div className="col-md-4 mob-mb-15">
                                            <select
                                                name="dob_year"
                                                ref={register({ required: true })}
                                                className="form-control suk-select-field"
                                                id="basic_dob_year"
                                                tabIndex="-1"
                                                aria-hidden="true">
                                                <option value="" key={`basic-dob-year-null`}>Year</option>
                                                {birthYears_birth_reg_en.map((type, index) => {
                                                    return <option value={type.value} key={`dob-year-key-${index}`}>{type.title}</option>;
                                                })}
                                            </select>

                                        </div>

                                    </div>
                                    {(errors.dob_day || errors.dob_month || errors.dob_year) && <div className="su-alert-phone">Please provide date of birth</div>}
                                </div>
                            </div>


                            {showCaptcha &&
                                <div className="row">
                                    <div className="col-md-6 mt-4">
                                        {/* <ReCAPTCHA
                                        sitekey={CAPTCHA_SITE_KEY}
                                        onChange={onCapthaChangeHandler}
                                    /> */}
                                        <CaptchaEn
                                            ref={captchaRef}
                                            callback={onCapthaChangeHandler}
                                        />
                                    </div>
                                </div>
                            }
                            <div className="row">
                                <div className="col-md-6 mt-4">
                                {
                                    FormLoading?
                                    <button type="button" className="loder-btn"> <i className="icon"></i> </button>
                                    :
                                    <button
                                        id="verify_send"
                                        onClick={handleSubmit(onOTPSent)}
                                        disabled={disableOtpSentButton}
                                        className="btn btn-primary btn-block">
                                        Verify
                                    </button>
                                }
                                </div>
                            </div>

                            {otpSent &&
                                <>

                                    <div className="row align-items-center">
                                        <div className="col-md-8 py-3 mr-auto">
                                            {otpMsg && <>
                                                <p>
                                                    {otpMsg}
                                                </p>
                                            </>
                                            }
                                        </div>
                                    </div>

                                    <div className="row align-items-center">
                                        <div className="col-md-6">
                                            <div className="form-group fv-plugins-icon-container has-success">

                                                <div className="input-group input-radious">
                                                    <input
                                                        type="number"
                                                        name="otp"
                                                        onChange={onOTPChangeHandler}
                                                        ref={register({
                                                            required: true,
                                                            minLength: 6,
                                                            maxLength: 6
                                                        })}
                                                        className="form-control"
                                                        autoComplete="off"
                                                        id="otp" />
                                                </div>
                                                {errors.otp &&
                                                    <div className="fv-help-block">Otp field should not empty</div>}
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form-group">
                                                {!disableResend && <>
                                                    <button
                                                        id="verify_send"
                                                        onClick={onOTPReSend}
                                                        disabled={disableResend}
                                                        className="btn btn-primary btn-block">
                                                        Resend OTP
                                                    </button>
                                                </>}

                                                {disableResend && <>
                                                    <button
                                                        id="verify_time"
                                                        onClick={onOTPReSend}
                                                        disabled={disableResend}
                                                        className="btn btn-block btn-danger">
                                                        <span className="su-otp-info-text">
                                                            Resend OTP
                                                        </span>
                                                        <span className="su-otp-time-count">
                                                            <CountdownTimer seconds={300} onCounterFinish={() => { setDisableResend(false) }} />
                                                        </span>
                                                    </button>
                                                </>}
                                            </div>
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mt-4">
                                        {
                                            FormLoadingTwo?
                                            <button type="button" className="loder-btn"> <i className="icon"></i> </button>
                                            :
                                            <button
                                                id="verify"
                                                onClick={handleSubmit(verifyOtp)}
                                                disabled={otpVerifying}
                                                className="btn btn-primary btn-block">
                                                Verify Status
                                            </button>
                                        }
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                        <br />
                    </div>
                </div>

            </div>
        </>
    );

}

export default ForeignerPassportVerify;