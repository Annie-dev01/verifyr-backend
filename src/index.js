const express = require('express')
const dotenv = require('dotenv')
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
//const job = require('../src/utils/cron-ping');



const companiesRouter = require("./routes/companies.routes");
const paymentsRouter  = require("./routes/payments.routes");
const connectDB = require("./configs/database");
const seedAdmin = require('./seeding/index');

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3001

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// connecting to db here
connectDB(process.env.MONGO_URI)
//job.start();
seedAdmin();

app.use(express.json())
app.use(morgan('combined'));
app.use(limiter)
app.use('/companies', companiesRouter); 
app.use('/payments', paymentsRouter);
app.use('/webhook', paymentsRouter);


app.listen(PORT, () => {
    console.log(`Server is running with speed at port ${PORT}`);
})