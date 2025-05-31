// export const host = "https://mahicommunity-4z64b.ondigitalocean.app";
export const host = "http://localhost:5000";

// secret key 
export const secretKey = "dc2aaf98722755f185671d4a4ef52395903eda7fa1871ab984f1934b25065429bbb5a9427bfcddd8a45b96d086bf764fb1f2b1d093749f0adef3cdaf1b2d11aa"


// razorpay route
export const razorpayRoute = "https://checkout.razorpay.com/v1/checkout.js";
export const razorpayKey = "rzp_test_Xk7M6YuPJpaWZA";



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

