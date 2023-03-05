import * as path from 'path';

export const OTPSECRECT = 'HJCCU6Z7NNAS4UCHMJFHOI3YN47UYS2C';

export const DB_CONNECTION = {
    PG: 'postgresConnection',
};

export const DEFAULT_PAGE_SIZE = 10;

export const MJML_EMAIL_TEMPLATE_PATH = path.join(__dirname, '..', 'shared/templates/mjml');

export const CACHE_KEY = {
    USER: 'USER',
    WEBSITE_SETTINGS: 'WEBSITE_SETTINGS',
    PARAMETERS_SETTINGS: 'PARAMETERS_SETTINGS',
    LOCATION: 'LOCATION',
    BANK: 'BANK',
    CATEGORY: 'CATEGORY',
    OTP: 'OTP',
    RESET_PASSWORD_REQUEST: 'RESET_PASSWORD_REQUEST',
    LATEST_FORGOT_PASSWORD: 'LATEST_FORGOT_PASSWORD',
    NEWS: 'NEWS',
    RESET_PIN_REQUEST: 'RESET_PIN_REQUEST',
    LATEST_FORGOT_PIN: 'LATEST_FORGOT_PIN',
    CONTRACT_OTP: 'CONTRACT_OTP',
    AUCTION_ACCESSOR: 'AUCTION_ACCESSOR',
    // Asset Flow
    WAITING_PUBLISH: 'WAITING_PUBLISH',
    WAITING_UNPUBLISH: 'WAITING_UNPUBLISH',
    WAITING_PROCESS: 'WAITING_PROCESS',
    WAITING_END: 'WAITING_END',
    // Complain
    CONFIRM_COMPLAIN_OTP: 'CONFIRM_COMPLAIN_OTP',
    CANCEL_ASSET_OTP: 'CANCEL_ASSET_OTP',
};

export const USER_ID = 'USER_ID';

export const OTP_SERVICE_ENDPOINT = 'rest.apiesms.com/MainService.svc/json/MultiChannelMessage';
export const OTP_CONTENT = 'Mã OTP của bạn là {{OTP}} Không tiết lộ cho bất kỳ ai, Mã xác nhận sẽ có hiệu lực trong 3 phút.';

export const OTP_VERIFY_SUCCESS_SECRET_KEY_EFFECT_TIME = 60; // in second
export const PASSWORD_MIN_LENGTH = 8;
export const TIME_TO_SIGN = 300; // seconds

export const NUMBER_WRONG_PASSWORD = 5;

export const REFRESH_AUCTION_ACCESSORS_TIME = 120; // second
