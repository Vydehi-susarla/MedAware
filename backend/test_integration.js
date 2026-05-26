const mongoose = require('mongoose');
const User = require('./models/User');
const Medicine = require('./models/Medicine');
const { getChatbotResponse } = require('./chatbot/chatbot');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medaware_test';

async function runTests() {
  console.log('--- STARTING INTEGRATION TESTS ---');
  console.log('Connecting to MongoDB...');
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to Test DB.');
  } catch (error) {
    console.error('ERROR: Could not connect to local MongoDB. Please make sure mongod is running.');
    console.error(error.message);
    process.exit(1);
  }

  try {
    // Clear test database
    console.log('Clearing database tables...');
    await User.deleteMany({});
    await Medicine.deleteMany({});

    // Test 1: User Registration
    console.log('\n[Test 1] Registering User A (Donor) and User B (Claimant)...');
    const userA = new User({
      name: 'User A (Donor)',
      email: 'usera@example.com',
      password: 'password123'
    });
    await userA.save();
    console.log('User A registered: ' + userA.name + ' (' + userA.email + ')');

    const userB = new User({
      name: 'User B (Claimant)',
      email: 'userb@example.com',
      password: 'password123'
    });
    await userB.save();
    console.log('User B registered: ' + userB.name + ' (' + userB.email + ')');

    // Test 2: Password Match
    console.log('\n[Test 2] Testing Password hashing & verification...');
    const isMatch = await userA.matchPassword('password123');
    const isNotMatch = await userA.matchPassword('wrongpassword');
    if (isMatch && !isNotMatch) {
      console.log('Password verification: PASSED');
    } else {
      throw new Error('Password verification: FAILED');
    }

    // Test 3: Medicine Donation
    console.log('\n[Test 3] User A donating a medicine...');
    const medicine = new Medicine({
      name: 'Amoxicillin 250mg',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days in future
      quantity: 15,
      description: 'Stored in a cool, dry place. Unused, full pack.',
      donor: userA._id
    });
    await medicine.save();
    console.log('Medicine donated: ' + medicine.name + ', Status: ' + medicine.status);

    // Test 4: Medicine Browse
    console.log('\n[Test 4] User B browsing available medicines...');
    const available = await Medicine.find({
      status: 'Available',
      donor: { $ne: userB._id }
    });
    if (available.length === 1 && available[0].name === 'Amoxicillin 250mg') {
      console.log('Browse medicines returned User A\'s donation: PASSED');
    } else {
      throw new Error('Browse medicines: FAILED');
    }

    // Test 5: Medicine Claim
    console.log('\n[Test 5] User B claiming medicine...');
    const medToClaim = available[0];
    const secretCode = 'MA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    medToClaim.status = 'Claimed';
    medToClaim.claimant = userB._id;
    medToClaim.secretCode = secretCode;
    await medToClaim.save();
    
    console.log('Medicine claimed. Status: ' + medToClaim.status + ', Secret Code: ' + medToClaim.secretCode);
    if (medToClaim.status === 'Claimed' && medToClaim.secretCode && medToClaim.claimant.toString() === userB._id.toString()) {
      console.log('Medicine claim workflow: PASSED');
    } else {
      throw new Error('Medicine claim workflow: FAILED');
    }

    // Test 6: Verification and Handover Completion
    console.log('\n[Test 6] User A verifying secret code from User B...');
    const claimedMed = await Medicine.findById(medToClaim._id);
    
    console.log('User B shares code "' + secretCode + '" with User A');
    console.log('User A enters code in system...');

    if (claimedMed.secretCode === secretCode) {
      claimedMed.status = 'Completed';
      await claimedMed.save();
      console.log('Handover code matches! Status updated to: ' + claimedMed.status);
    } else {
      throw new Error('Verification: code mismatch failed');
    }

    if (claimedMed.status === 'Completed') {
      console.log('Handover verification workflow: PASSED');
    } else {
      throw new Error('Handover verification workflow: FAILED');
    }

    // Test 7: Chatbot Query
    console.log('\n[Test 7] Testing Disposal Chatbot responses...');
    const q1 = "How to dispose expired tablets?";
    const r1 = getChatbotResponse(q1);
    console.log('Q: ' + q1);
    console.log('A: ' + r1.substring(0, 100) + '...');
    
    const q2 = "Can I use expired syrup?";
    const r2 = getChatbotResponse(q2);
    console.log('Q: ' + q2);
    console.log('A: ' + r2.substring(0, 100) + '...');

    if (r1 && r2 && r1 !== r2) {
      console.log('Chatbot keyword response parsing: PASSED');
    } else {
      throw new Error('Chatbot response: FAILED');
    }

    console.log('\n--- ALL INTEGRATION TESTS PASSED SUCCESSFULLY! ---');

  } catch (err) {
    console.error('\n!!! TEST RUN ENCOUNTERED AN ERROR !!!');
    console.error(err.message);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

runTests();
