import express from 'express';
import { affileDetails, getAffiliateAnalytics, getAffiliateStats, getMessagesByRef } from '../controllers/affileController.js';

const affiliateRouter = express.Router();

affiliateRouter.post("/", affileDetails);
// Get affiliate analytics
affiliateRouter.get('/analytics', getAffiliateAnalytics);

// Get affiliate statistics
affiliateRouter.get('/stats', getAffiliateStats);
affiliateRouter.post("/getMessagesByRef", getMessagesByRef);


export default affiliateRouter; 