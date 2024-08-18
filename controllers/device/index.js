const { Device } = require('../../models');
const routeHandler = require('../../utils/routeHandler');
const { findModelOrThrow, validateNullParameters, } = require('../../utils/validation');
const { STATUS_CODE } = require('../../utils/constants');
const jwt = require('jsonwebtoken');
const { firebase } = require('../../firebase');

const register = routeHandler(async (req, res, extras) => {
    const {
        body: {
            name,
            device_unique_id,
            device_unique_id_type,
            platform,
            fcm_token,
            app_version,
        },
        auth: {
            user_id,
        },
    } = req;

    validateNullParameters([name, device_unique_id,
        device_unique_id_type, platform, fcm_token, app_version,]);

    const [device, isCreated] = await Device.upsert({
        user_id,
        name,
        device_unique_id,
        device_unique_id_type,
        platform,
        fcm_token,
        app_version,
    }, { transaction: extras.transaction });

    await device.reload({ transaction: extras.transaction, paranoid: false });
    if (device.isSoftDeleted()) {
        await device.restore({ transaction: extras.transaction });
    }

    await firebase.messaging().subscribeToTopic(fcm_token, 'chat_app')
        .then(() => console.log('Successfully subscribed to topic'))
        .catch((err) => console.log('Error subscribing to topic: ', err));

    await extras.transaction.commit();

    return res.sendRes(device, { message: 'Device created successfully', status: STATUS_CODE.OK, });
});

module.exports = {
    register,
}