const Invoice = require("./models/erpModels/Invoice");
const Quote = require("./models/erpModels/Quote");

exports.invoiceCronJob = async () => {
  try{
    console.log("invoice cron job started...");
    let currentDate =  new Date().toISOString();
    currentDate = currentDate.substring(0,currentDate.length -1);
    
    // Updating expired Invoice
    await Invoice.updateMany(
      { expiredDate: { $lt:  currentDate }, status: { $ne: 'overdue' }  },
      { $set: { status: 'overdue' } }
      );
      
    console.log("invoice cron job completed");
  }catch(e){
    console.error(e);
  }
}

exports.quoteCronJob = async () => {
  try{
    
    console.log("quote cron job started...");
    let currentDate =  new Date().toISOString();
    currentDate = currentDate.substring(0,currentDate.length -1);
    
    // Updating expired Quotes
    await Quote.updateMany(
      { expiredDate: { $lt:  currentDate }, status: { $ne: 'expired' }  },
      { $set: { status: 'expired' } }
      );
      
    console.log("quote cron job completed");
  }catch(e){
    console.error(e);
  }
}
