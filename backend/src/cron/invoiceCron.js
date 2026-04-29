const cron = require('node-cron');
const Invoice = require('../models/appModels/Invoice');

// 📚 Cron format: 'minute hour day month weekday'
// '0 0 * * *' means → at 00:00 (midnight) every day
cron.schedule('0 0 * * *', async () => {
  console.log('⏰ Running daily invoice expiry check...');

  const today = new Date();

  try {
    // 📚 updateMany = update ALL documents that match the filter
    const expiredInvoices = await Invoice.updateMany(
      {
        // 📚 $lt = "less than" → find invoices where expiredDate < today
        expiredDate: { $lt: today },
        isOverdue: false, // only update ones not already marked
        removed: false,   // skip deleted invoices
      },
      {
        // 📚 $set = update these fields
        $set: {
          isOverdue: true,
          status: 'overdue',
        },
      }
    );

    console.log(`✅ ${expiredInvoices.modifiedCount} invoices marked as overdue`);

  } catch (error) {
    console.error('❌ Cron job failed:', error.message);
  }
});

console.log('✅ Invoice expiry cron job scheduled — runs daily at midnight!');