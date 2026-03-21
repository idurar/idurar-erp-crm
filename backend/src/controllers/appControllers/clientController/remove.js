const mongoose = require('mongoose');

// --- Centralized Model Access (Good Practice) ---
// Note: Assuming this controller is used specifically for the 'Client' model (which isn't explicitly defined here but inferred)
const ClientModel = mongoose.model('Client'); // Assuming 'Client' is the model being deleted
const QuoteModel = mongoose.model('Quote');
const InvoiceModel = mongoose.model('Invoice');
const PeopleModel = mongoose.model('People'); // Renamed to PeopleModel for clarity
const CompanyModel = mongoose.model('Company'); // Renamed to CompanyModel for clarity

/**
 * Handles the removal (deletion) of a Client, but only if they have no active Quotes or Invoices.
 * It also cleans up the associated People or Company record's 'isClient' flag.
 *
 * @param {object} Model - The Mongoose Model (expected to be 'Client' or similar).
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const remove = async (Model, req, res) => {
    // We explicitly use ClientModel here, but maintain the 'Model' parameter if this function is generic
    const CurrentModel = Model || ClientModel;

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format.',
        });
    }

    try {
        // --- 1. Dependency Check (Prevent Deletion) ---
        // Find if there is at least one active quote or invoice corresponding to this client ID.
        // We use findOne() which is efficient for checking existence.
        const resultQuotesPromise = QuoteModel.findOne({ client: id, removed: false }).select('_id').lean().exec();
        const resultInvoicePromise = InvoiceModel.findOne({ client: id, removed: false }).select('_id').lean().exec();

        // Use Promise.all to concurrently check for dependencies.
        const [quotes, invoices] = await Promise.all([resultQuotesPromise, resultInvoicePromise]);

        if (quotes || invoices) { // Check if either result is not null/undefined
            return res.status(409).json({ // 409 Conflict is more appropriate than 400
                success: false,
                result: null,
                message: 'Cannot delete client. They have active quotes or invoices.',
            });
        }

        // --- 2. Client Deletion ---
        // Find and delete the client document.
        const clientResult = await CurrentModel.findOneAndDelete({ _id: id, removed: false }).exec();

        if (!clientResult) {
            return res.status(404).json({
                success: false,
                result: null,
                message: `Client not found or already deleted by ID: ${id}`,
            });
        }

        // --- 3. Cleanup (Update isClient Flag) ---
        // Determine the associated model (People or Company) and update the flag.
        let cleanupModel = null;
        let associatedId = null;

        if (clientResult.type === 'people' && clientResult.people && clientResult.people._id) {
            cleanupModel = PeopleModel;
            associatedId = clientResult.people._id;
        } else if (clientResult.type === 'company' && clientResult.company && clientResult.company._id) {
            cleanupModel = CompanyModel;
            associatedId = clientResult.company._id;
        }

        if (cleanupModel && associatedId) {
            const updateResult = await cleanupModel.findOneAndUpdate(
                {
                    _id: associatedId,
                    removed: false,
                },
                { isClient: false },
                {
                    new: true,
                    runValidators: true,
                    // Use select to minimize data transfer if needed: .select('isClient')
                }
            ).exec();

            if (!updateResult) {
                console.warn(`Cleanup failed: Associated ${clientResult.type} record not found for ID: ${associatedId}`);
                // Note: The client is deleted, so we proceed, but log the warning.
            }
        } else {
            // Log if the type/ID is missing, but still proceed with success response
            console.warn(`Client deletion (ID: ${id}) completed, but associated type/ID for cleanup was missing or invalid.`);
        }

        // --- 4. Success Response ---
        return res.status(200).json({
            success: true,
            result: null,
            message: `Successfully deleted client: ${id}`,
        });

    } catch (error) {
        console.error('Error during client deletion:', error);
        return res.status(500).json({
            success: false,
            result: null,
            message: 'An unexpected server error occurred during deletion.',
            error: error.message,
        });
    }
};

module.exports = remove;
