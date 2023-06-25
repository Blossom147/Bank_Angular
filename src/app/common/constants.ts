// API
export const API_BASE_URL = 'http://localhost:8080/infogw/qr/v1';

// API User Manager
export const API_GET_ALL_USER =  API_BASE_URL + '/getAllUsers';
export const API_GET_USER =  API_BASE_URL + '/adminGetUser/';
export const API_DELETE_USER =  API_BASE_URL + '/deleteUser/';
export const API_UPDATE_USER =  API_BASE_URL + '/updateUser';

// API login
export const API_LOGIN = API_BASE_URL + '/oauth/token';
export const API_GET_ROLE = API_BASE_URL + '/getRole/';

// API GenQR
export const API_GET_BANKS = API_BASE_URL + '/banks';
export const API_GENQR = API_BASE_URL + '/genQR';
export const API_GENQR_ADS = API_BASE_URL + '/genAdQR';

// API Transaction
export const API_GET_COUNT_TRANSACTION = API_BASE_URL + '/transactionCount';
export const API_SEARCH_TRANSACTION = API_BASE_URL + '/transactionSearch';
export const API_SEARCH_TRANSACTION_ACTIVITY = API_BASE_URL + '/transactions/';
export const API_GET_TRANSACTIONS = API_BASE_URL + '/transactions';


// API QR Manager ADMIN
export const API_GET_ALL_QR = API_BASE_URL + '/getAllQR';
export const API_COUNT_QR = API_BASE_URL + '/qrCodeCount';
export const API_DELETE_QR = API_BASE_URL + '/deleteQr/';
export const API_SEARCH_QR = API_BASE_URL + '/searchQR';

// API QR Manager USER
export const API_GET_ALL_QR_USER = API_BASE_URL + '/getQRByUsername/';
export const API_SEARCH_QR_USER = API_BASE_URL + '/qrSearch';
export const API_DELETE_QR_USER = API_BASE_URL + '/deleteQrUser/';
export const API_UPDATE_QR_USER = API_BASE_URL + '/updateQR';
export const API_GET_QR_BY_ID = API_BASE_URL + '/getQRByid/';

// API Update User Details
export const API_GET_USER_DETAILS = API_BASE_URL + '/getUserDetails';
export const API_UPDATE_USER_DETAILS = API_BASE_URL + '/updateUserDetails';
