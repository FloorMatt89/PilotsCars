#!/usr/bin/env node

/**
 * PilotCars Database Seeding Script
 *
 * This script:
 * 1. Creates 5 auth users with specific UUIDs in Supabase Auth
 * 2. Creates their user profiles in public.users
 * 3. Seeds locations, vehicles, bookings, and referrals
 *
 * Usage:
 *   node scripts/seed-database.js
 *
 * Requirements:
 *   - SUPABASE_SERVICE_ROLE_KEY in environment or .env.local
 *   - NEXT_PUBLIC_SUPABASE_URL in environment or .env.local
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local if it exists
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#') && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value;
      }
    }
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const TEST_USERS = [
  {
    email: 'alice@test.com',
    password: 'alice1234',
    full_name: 'Alice Johnson',
    phone: '+1-305-555-1001',
    is_verified: true,
  },
  {
    email: 'bob@test.com',
    password: 'bob1234',
    full_name: 'Bob Smith',
    phone: '+1-305-555-1002',
    is_verified: true,
  },
  {
    email: 'charlie@test.com',
    password: 'charlie1234',
    full_name: 'Charlie Brown',
    phone: '+1-407-555-1003',
    is_verified: false,
  },
  {
    email: 'diana@test.com',
    password: 'diana1234',
    full_name: 'Diana Prince',
    phone: '+1-305-555-1004',
    is_verified: true,
  },
  {
    email: 'eve@test.com',
    password: 'eve1234',
    full_name: 'Eve Wilson',
    phone: '+1-305-555-1005',
    is_verified: true,
  },
];

// Will be populated with actual user IDs after auth users are created
const USER_IDS = {};

async function createAuthUsers() {
  console.log('\n📝 Fetching/creating auth users...');

  // First, get all existing users
  try {
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    existingUsers?.users?.forEach((u) => {
      const testUser = TEST_USERS.find((t) => t.email === u.email);
      if (testUser) {
        USER_IDS[testUser.email] = u.id;
      }
    });
  } catch (err) {
    console.error('  ⚠️  Could not list existing users:', err.message);
  }

  // Now create any missing users
  for (const user of TEST_USERS) {
    if (USER_IDS[user.email]) {
      console.log(`  ⏭️  ${user.email} already exists (ID: ${USER_IDS[user.email]})`);
      continue;
    }

    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: { full_name: user.full_name },
      });

      if (error) {
        console.error(`  ❌ Error creating ${user.email}:`, error.message);
      } else {
        USER_IDS[user.email] = data.user.id;
        console.log(`  ✅ Created ${user.email} (ID: ${data.user.id})`);
      }
    } catch (err) {
      console.error(`  ❌ Error creating ${user.email}:`, err.message);
    }
  }
}

async function createUserProfiles() {
  console.log('\n👤 Creating user profiles...');

  for (const user of TEST_USERS) {
    try {
      const userId = USER_IDS[user.email];
      if (!userId) {
        console.error(`  ❌ No user ID found for ${user.email}`);
        continue;
      }

      const { error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          is_verified: user.is_verified,
          verified_at: user.is_verified ? new Date().toISOString() : null,
        })
        .select();

      if (error) {
        if (error.message.includes('duplicate')) {
          console.log(`  ⏭️  Profile for ${user.email} already exists`);
        } else {
          console.error(`  ❌ Error creating profile for ${user.email}:`, error.message);
        }
      } else {
        console.log(`  ✅ Created profile for ${user.email}`);
      }
    } catch (err) {
      console.error(`  ❌ Error creating profile for ${user.email}:`, err.message);
    }
  }
}

async function seedLocations() {
  console.log('\n📍 Seeding locations...');

  const locations = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Miami Airport Rental',
      city: 'Miami',
      address: '2100 NW 42nd Ave, Miami, FL 33142',
      phone: '+1-305-555-0100',
      hours_open: '6am-11pm',
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Downtown Miami',
      city: 'Miami',
      address: '100 Biscayne Blvd, Miami, FL 33132',
      phone: '+1-305-555-0101',
      hours_open: '7am-9pm',
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Orlando Downtown',
      city: 'Orlando',
      address: '123 Main St, Orlando, FL 32801',
      phone: '+1-407-555-0200',
      hours_open: '7am-10pm',
    },
  ];

  for (const location of locations) {
    try {
      const { error } = await supabase
        .from('locations')
        .insert(location)
        .select();

      if (error && !error.message.includes('duplicate')) {
        console.error(`  ❌ Error seeding location ${location.name}:`, error.message);
      } else {
        console.log(`  ✅ Location: ${location.name}`);
      }
    } catch (err) {
      console.error(`  ❌ Error seeding location ${location.name}:`, err.message);
    }
  }
}

async function seedVehicles() {
  console.log('\n🚗 Seeding vehicles...');

  const vehicles = [
    {
      location_id: '11111111-1111-1111-1111-111111111111',
      make: 'Toyota',
      model: 'Corolla',
      year: 2023,
      color: 'White',
      license_plate: 'XYZ-9001',
      vehicle_type: 'sedan',
      daily_rate: 79.99,
      is_available: true,
      features: ['GPS', 'bluetooth'],
      mileage: 5000,
    },
    {
      location_id: '11111111-1111-1111-1111-111111111111',
      make: 'Honda',
      model: 'Civic',
      year: 2023,
      color: 'Blue',
      license_plate: 'XYZ-9002',
      vehicle_type: 'sedan',
      daily_rate: 79.99,
      is_available: true,
      features: ['GPS', 'backup camera'],
      mileage: 8000,
    },
    {
      location_id: '11111111-1111-1111-1111-111111111111',
      make: 'Mazda',
      model: 'CX-5',
      year: 2023,
      color: 'Red',
      license_plate: 'XYZ-9003',
      vehicle_type: 'suv',
      daily_rate: 119.99,
      is_available: true,
      features: ['GPS', 'leather', 'bluetooth'],
      mileage: 12000,
    },
    {
      location_id: '33333333-3333-3333-3333-333333333333',
      make: 'Toyota',
      model: 'Highlander',
      year: 2022,
      color: 'Silver',
      license_plate: 'XYZ-9004',
      vehicle_type: 'suv',
      daily_rate: 139.99,
      is_available: true,
      features: ['GPS', 'leather', 'backup camera'],
      mileage: 20000,
    },
  ];

  for (const vehicle of vehicles) {
    try {
      const { error } = await supabase
        .from('vehicles')
        .insert(vehicle)
        .select();

      if (error && !error.message.includes('duplicate')) {
        console.error(`  ❌ Error seeding ${vehicle.make} ${vehicle.model}:`, error.message);
      } else {
        console.log(`  ✅ Vehicle: ${vehicle.make} ${vehicle.model} (${vehicle.license_plate})`);
      }
    } catch (err) {
      console.error(`  ❌ Error seeding ${vehicle.make} ${vehicle.model}:`, err.message);
    }
  }
}

async function seedBookings() {
  console.log('\n📅 Seeding bookings...');

  // Get vehicle and location IDs
  const { data: vehicles } = await supabase.from('vehicles').select('id, license_plate');
  const { data: locations } = await supabase.from('locations').select('id, city');

  const vehicleMap = {};
  vehicles?.forEach((v) => {
    vehicleMap[v.license_plate] = v.id;
  });

  const miamiLocation = locations?.find((l) => l.city === 'Miami');
  const orlandoLocation = locations?.find((l) => l.city === 'Orlando');

  const bookings = [
    // Alice's bookings
    {
      user_id: USER_IDS['alice@test.com'],
      vehicle_id: vehicleMap['XYZ-9001'],
      location_id: miamiLocation?.id,
      pickup_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      return_date: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      pickup_time: '09:00:00',
      return_time: '17:00:00',
      status: 'completed',
      total_price: 449.95,
      notes: 'Trip to Miami Beach',
    },
    {
      user_id: USER_IDS['alice@test.com'],
      vehicle_id: vehicleMap['XYZ-9002'],
      location_id: miamiLocation?.id,
      pickup_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      return_date: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      pickup_time: '10:00:00',
      return_time: '18:00:00',
      status: 'completed',
      total_price: 239.97,
      notes: 'Airport transport',
    },
    // Bob's bookings
    {
      user_id: USER_IDS['bob@test.com'],
      vehicle_id: vehicleMap['XYZ-9003'],
      location_id: miamiLocation?.id,
      pickup_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      return_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      pickup_time: '08:00:00',
      return_time: '16:00:00',
      status: 'pending',
      total_price: 359.97,
      notes: 'Upcoming weekend trip',
    },
    {
      user_id: USER_IDS['bob@test.com'],
      vehicle_id: vehicleMap['XYZ-9001'],
      location_id: miamiLocation?.id,
      pickup_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      return_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      pickup_time: '09:00:00',
      return_time: '17:00:00',
      status: 'confirmed',
      total_price: 399.95,
      notes: 'Business trip',
    },
    // Diana's bookings
    {
      user_id: USER_IDS['diana@test.com'],
      vehicle_id: vehicleMap['XYZ-9004'],
      location_id: orlandoLocation?.id,
      pickup_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      return_date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      pickup_time: '10:00:00',
      return_time: '16:00:00',
      status: 'completed',
      total_price: 699.95,
      notes: 'Orlando conference',
    },
    {
      user_id: USER_IDS['diana@test.com'],
      vehicle_id: vehicleMap['XYZ-9002'],
      location_id: miamiLocation?.id,
      pickup_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      return_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      pickup_time: '09:00:00',
      return_time: '18:00:00',
      status: 'completed',
      total_price: 239.97,
      notes: 'Crew layover',
    },
    {
      user_id: USER_IDS['diana@test.com'],
      vehicle_id: vehicleMap['XYZ-9001'],
      location_id: miamiLocation?.id,
      pickup_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      return_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      pickup_time: '10:00:00',
      return_time: '17:00:00',
      status: 'cancelled',
      total_price: 159.98,
      notes: 'Cancelled due to flight change',
    },
    // Eve's bookings
    {
      user_id: USER_IDS['eve@test.com'],
      vehicle_id: vehicleMap['XYZ-9003'],
      location_id: miamiLocation?.id,
      pickup_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      return_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      pickup_time: '07:00:00',
      return_time: '19:00:00',
      status: 'completed',
      total_price: 239.98,
      notes: 'Short crew rotation',
    },
  ];

  for (const booking of bookings) {
    try {
      const { error } = await supabase
        .from('bookings')
        .insert(booking)
        .select();

      if (error && !error.message.includes('duplicate')) {
        console.error(`  ❌ Error creating booking:`, error.message);
      } else {
        console.log(`  ✅ Booking: ${booking.notes} (${booking.status})`);
      }
    } catch (err) {
      console.error(`  ❌ Error creating booking:`, err.message);
    }
  }
}

async function seedReferrals() {
  console.log('\n💰 Seeding referrals...');

  // Get booking IDs for commission calculations
  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, user_id, total_price');

  const bookingMap = {};
  bookings?.forEach((b) => {
    bookingMap[b.user_id] = b;
  });

  const referrals = [
    // Alice referred Bob
    {
      referrer_id: USER_IDS['alice@test.com'],
      referred_user_id: USER_IDS['bob@test.com'],
      booking_id: bookingMap[USER_IDS['bob@test.com']]?.id,
      commission_earned: bookingMap[USER_IDS['bob@test.com']]?.total_price * 0.08 || 0,
      status: 'earned',
      paid_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // Bob referred Diana
    {
      referrer_id: USER_IDS['bob@test.com'],
      referred_user_id: USER_IDS['diana@test.com'],
      booking_id: bookingMap[USER_IDS['diana@test.com']]?.id,
      commission_earned: (bookingMap[USER_IDS['diana@test.com']]?.total_price || 0) * 0.08,
      status: 'earned',
      paid_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // Diana referred Eve
    {
      referrer_id: USER_IDS['diana@test.com'],
      referred_user_id: USER_IDS['eve@test.com'],
      booking_id: bookingMap[USER_IDS['eve@test.com']]?.id,
      commission_earned: bookingMap[USER_IDS['eve@test.com']]?.total_price * 0.08 || 0,
      status: 'paid',
      paid_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // Eve referred Charlie (pending - no booking)
    {
      referrer_id: USER_IDS['eve@test.com'],
      referred_user_id: USER_IDS['charlie@test.com'],
      booking_id: null,
      commission_earned: 0,
      status: 'pending',
      paid_at: null,
    },
  ];

  for (const referral of referrals) {
    try {
      const { error } = await supabase
        .from('referrals')
        .insert(referral)
        .select();

      if (error && !error.message.includes('duplicate')) {
        console.error(`  ❌ Error creating referral:`, error.message);
      } else {
        const amount = referral.commission_earned ? `$${referral.commission_earned.toFixed(2)}` : 'pending';
        console.log(`  ✅ Referral: ${referral.status} (${amount})`);
      }
    } catch (err) {
      console.error(`  ❌ Error creating referral:`, err.message);
    }
  }
}

async function main() {
  console.log('🌱 PilotCars Database Seeding Script');
  console.log('====================================\n');

  try {
    await createAuthUsers();
    await createUserProfiles();
    await seedLocations();
    await seedVehicles();
    await seedBookings();
    await seedReferrals();

    console.log('\n✅ Database seeding complete!');
    console.log('\nTest accounts created:');
    TEST_USERS.forEach((u) => {
      console.log(`  • ${u.email} (password: ${u.password})`);
    });
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
