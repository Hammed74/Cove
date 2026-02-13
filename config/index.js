module.exports = {
    port: process.env.PORT || 3000,
    cors: {
        origin: "*", //in prod list specific domains
        methods: ["GET", "POST"] 
    }
};