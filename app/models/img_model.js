const mongoose = require('mongoose');

// Actual DB modelvar 
imageSchema = mongoose.Schema({
    filename: String,
    originalName: String,
    desc: String,
    userID: String,
    lat: Number,
    lon: Number,
    created: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', imageSchema);                                    
module.exports = {
	imageSchema: imageSchema,
	Image: Image
}
