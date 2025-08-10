import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name for this address (e.g., Home, Work).'],
  },
  firstName: {
    type: String,
    required: [true, 'Please provide a first name.'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a last name.'],
  },
  address: {
    type: String,
    required: [true, 'Please provide a street address.'],
  },
  apartment: {
    type: String,
  },
  city: {
    type: String,
    required: [true, 'Please provide a city.'],
  },
  state: {
    type: String,
    required: [true, 'Please provide a state or province.'],
  },
  zip: {
    type: String,
    required: [true, 'Please provide a ZIP or postal code.'],
  },
  country: {
    type: String,
    required: [true, 'Please provide a country.'],
  },
}, { timestamps: true });

export default mongoose.models.Address || mongoose.model('Address', AddressSchema);