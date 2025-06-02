export const host = process.env.REACT_APP_SERVER_CALL;

// secret key 
export const secretKey = process.env.REACT_APP_APP_ID;


// razorpay route
export const razorpayRoute = process.env.REACT_APP_PAYMENT_ROUTE;
export const razorpayKey = process.env.REACT_APP_PAYMENT_ID;



// Auth routes
export const signupRoute = `${host}/auth/signup`;
export const loginRoute = `${host}/auth/login`;
export const paymentRoute = `${host}/auth/payments/create-order`
export const getMessagesRoute = `${host}/auth/getMessages`;



// Admin routes
export const addProductRoute = `${host}/admin/addProduct`;
export const getMyProductsRoute = `${host}/admin/getProducts`;
export const editMyProductRoute = `${host}/admin/editProduct`;
export const deleteMyProductRoute = `${host}/admin/deleteProduct`;
export const salesAnalyticsRoute = `${host}/admin/sales-analytics`;
export const getAffiliatorsRoute = `${host}/admin/getAffiles`;
export const deleteAffiliatorRoute = `${host}/admin/deleteAffiliator`;
export const updateAffiliatorRoute = `${host}/admin/updateAffiliator`;
export const resetCommissionsRoute = `${host}/admin/updateAffiliator/reset`;
export const toggleRestrictionRoute = `${host}/admin/toggleRestriction`;
export const findReferralRoute = `${host}/admin/findReferral`;


// User routes
export const getAllProductsRoute = `${host}/user/getAllProducts`;
// export const findSimilarProductsRoute = "http://127.0.0.1:5000/find_similar";
export const buyNowRoute = `${host}/user/buyNow`;
export const buyAllRoute = `${host}/user/buyAll`;
export const getProductDetailsRoute = `${host}/user/getProductDetails`




// Affiliator routes
export const affileDetailsRoute = `${host}/affiliate`;
export const affileAnalyticsRoute = `${host}/affiliate/analytics`;
export const getMessagesByRefRoute = `${host}/affiliate/getMessagesByRef`;

