/**
 * @type {import('@thebcms/cli/config').BCMSConfig}
 */
module.exports = {
    client: {
        orgId: process.env.BCMS_ORG_ID || '6783d604072c6366eee713d2',
        instanceId: process.env.BCMS_INSTANCE_ID || '6800d4dfc767a9b6743b0ab6',
        apiKey: {
            id: process.env.BCMS_API_KEY_ID || '6800d855c767a9b6743b0ad2',
            secret: process.env.BCMS_API_KEY_SECRET || '69ac1a1d8aadc9d7702b574dc1c38d98833ae124bea11872d84fa49bc35bb62f',
        },
    },
};