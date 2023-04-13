import AccountUtils from '../utils/account.utils.js';
import utils from '../utils/utils.js';

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const payload = await AccountUtils.verfiyAccessToken(token);
        req.payload = payload;
        next();
    } catch (error) {
        utils.writeErrorToLog(error);
        res.status(401).json({
            status: 'error',
            message: 'Unauthorized'
        });
    }
}

export default auth;