const axios = require('axios');

const Transaction = require("../models/transaction.model")
const responses = require("../utils/response");
const generateReference = require('../utils/generatePaymentReference');

const initiatePayment = async (user) => {
    try {
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET}`
            }
        }
        const body = {
            amount: Number(process.env.AMOUNT) * 100,
            email: user.email,
            reference: generateReference()
        };

        const response = await axios.post(process.env.PAYSTACK_URL, body, options)
        console.log(response);
        await Transaction.create(body)
        return responses.buildSuccessResponse("Transaction Initialized", 200, response)
    } catch (error) {
        console.log(error);
        return responses.buildFailureResponse(error?.message, error?.statusCode)
    }
}

module.exports = {
    initiatePayment
}