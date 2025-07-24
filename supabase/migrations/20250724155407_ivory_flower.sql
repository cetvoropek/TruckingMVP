/*
  # Seed Data for TruckRecruit AI

  This file creates sample data for testing the application:
  - Sample drivers with realistic profiles
  - Sample recruiters with companies
  - Sample applications and messages
  - Sample interviews and contact unlocks
*/

-- Insert sample profiles (these would normally be created via auth)
INSERT INTO profiles (id, email, name, role, phone, location) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'michael.rodriguez@email.com', 'Michael Rodriguez', 'driver', '+1 (555) 123-4567', 'Dallas, TX'),
  ('550e8400-e29b-41d4-a716-446655440002', 'james.wilson@email.com', 'James Wilson', 'driver', '+1 (555) 987-6543', 'Phoenix, AZ'),
  ('550e8400-e29b-41d4-a716-446655440003', 'sarah.johnson@email.com', 'Sarah Johnson', 'driver', '+1 (555) 321-0987', 'Atlanta, GA'),
  ('550e8400-e29b-41d4-a716-446655440004', 'david.chen@email.com', 'David Chen', 'driver', '+1 (555) 456-7890', 'Denver, CO'),
  ('550e8400-e29b-41d4-a716-446655440005', 'maria.garcia@email.com', 'Maria Garcia', 'driver', '+1 (555) 654-3210', 'Phoenix, AZ'),
  ('550e8400-e29b-41d4-a716-446655440006', 'robert.smith@email.com', 'Robert Smith', 'driver', '+1 (555) 789-0123', 'Houston, TX'),
  ('550e8400-e29b-41d4-a716-446655440007', 'lisa.brown@email.com', 'Lisa Brown', 'driver', '+1 (555) 234-5678', 'Miami, FL'),
  ('550e8400-e29b-41d4-a716-446655440008', 'john.davis@email.com', 'John Davis', 'driver', '+1 (555) 345-6789', 'Seattle, WA'),
  
  -- Recruiters
  ('550e8400-e29b-41d4-a716-446655440101', 'recruiter1@translogistics.com', 'Amanda Thompson', 'recruiter', '+1 (555) 111-2222', 'Dallas, TX'),
  ('550e8400-e29b-41d4-a716-446655440102', 'recruiter2@fasthaul.com', 'Mark Johnson', 'recruiter', '+1 (555) 333-4444', 'Phoenix, AZ'),
  ('550e8400-e29b-41d4-a716-446655440103', 'recruiter3@crosscountry.com', 'Jennifer Lee', 'recruiter', '+1 (555) 555-6666', 'Atlanta, GA');

-- Insert driver profiles
INSERT INTO drivers (id, experience_years, license_types, twic_card, hazmat_endorsement, availability, preferred_routes, equipment_experience, fit_score, profile_completion, documents_verified, bio) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 8, ARRAY['CDL-A'], true, true, 'available', ARRAY['OTR', 'Regional'], ARRAY['Dry Van', 'Flatbed'], 9.2, 95, true, 'Experienced OTR driver with excellent safety record and 8 years of professional driving experience.'),
  ('550e8400-e29b-41d4-a716-446655440002', 5, ARRAY['CDL-A'], true, false, 'available', ARRAY['Regional', 'Local'], ARRAY['Reefer', 'Dry Van'], 8.8, 85, true, 'Reliable regional driver specializing in temperature-controlled freight with clean driving record.'),
  ('550e8400-e29b-41d4-a716-446655440003', 3, ARRAY['CDL-A'], false, false, 'available', ARRAY['Local', 'Regional'], ARRAY['Dry Van', 'Auto Transport'], 8.5, 75, true, 'Dedicated professional driver with focus on auto transport and excellent customer service skills.'),
  ('550e8400-e29b-41d4-a716-446655440004', 12, ARRAY['CDL-A'], true, true, 'seeking', ARRAY['OTR', 'Specialized'], ARRAY['Tanker', 'HAZMAT'], 9.0, 100, true, 'Veteran driver with specialized experience in hazardous materials transportation and tanker operations.'),
  ('550e8400-e29b-41d4-a716-446655440005', 2, ARRAY['CDL-A'], false, false, 'available', ARRAY['Local'], ARRAY['Dry Van'], 7.8, 60, false, 'New professional driver eager to build experience in local and regional routes.'),
  ('550e8400-e29b-41d4-a716-446655440006', 15, ARRAY['CDL-A'], true, true, 'employed', ARRAY['OTR'], ARRAY['Flatbed', 'Heavy Haul'], 9.5, 100, true, 'Highly experienced flatbed specialist with expertise in oversized loads and heavy haul operations.'),
  ('550e8400-e29b-41d4-a716-446655440007', 6, ARRAY['CDL-A'], false, false, 'available', ARRAY['Regional'], ARRAY['Reefer'], 8.3, 80, true, 'Experienced reefer driver with strong knowledge of temperature-controlled logistics.'),
  ('550e8400-e29b-41d4-a716-446655440008', 4, ARRAY['CDL-A'], true, false, 'seeking', ARRAY['Local', 'Regional'], ARRAY['Dry Van', 'Box Truck'], 8.1, 70, true, 'Reliable driver with local and regional experience, looking for growth opportunities.');

-- Insert recruiter profiles
INSERT INTO recruiters (id, company_name, company_size, website, contacts_unlocked) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', 'TransLogistics Inc.', '500-1000', 'https://translogistics.com', 45),
  ('550e8400-e29b-41d4-a716-446655440102', 'FastHaul Express', '100-500', 'https://fasthaul.com', 23),
  ('550e8400-e29b-41d4-a716-446655440103', 'CrossCountry Freight', '1000+', 'https://crosscountry.com', 67);

-- Insert subscriptions
INSERT INTO subscriptions (recruiter_id, type, status, contacts_limit, contacts_used, price_monthly, current_period_end) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', 'pro', 'active', 100, 45, 199.00, '2024-03-15'::timestamptz),
  ('550e8400-e29b-41d4-a716-446655440102', 'starter', 'active', 25, 23, 99.00, '2024-02-28'::timestamptz),
  ('550e8400-e29b-41d4-a716-446655440103', 'enterprise', 'active', NULL, 67, 399.00, '2024-04-01'::timestamptz);

-- Insert sample documents
INSERT INTO driver_documents (driver_id, name, type, file_name, file_size, verified, expiry_date) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'CDL License', 'license', 'cdl_license.pdf', '2.4 MB', true, '2026-03-15'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Medical Certificate', 'medical', 'medical_cert.pdf', '1.2 MB', true, '2025-01-08'),
  ('550e8400-e29b-41d4-a716-446655440001', 'TWIC Card', 'twic', 'twic_card.jpg', '856 KB', true, '2027-05-20'),
  ('550e8400-e29b-41d4-a716-446655440001', 'HAZMAT Endorsement', 'hazmat', 'hazmat_cert.pdf', '1.8 MB', true, '2025-12-10'),
  ('550e8400-e29b-41d4-a716-446655440002', 'CDL License', 'license', 'cdl_license_jw.pdf', '2.1 MB', true, '2025-08-22'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Medical Certificate', 'medical', 'medical_cert_jw.pdf', '1.1 MB', true, '2024-12-15'),
  ('550e8400-e29b-41d4-a716-446655440003', 'CDL License', 'license', 'cdl_license_sj.pdf', '2.3 MB', true, '2026-01-10');

-- Insert job postings
INSERT INTO job_postings (recruiter_id, title, description, location, job_type, salary_min, salary_max, requirements, benefits) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', 'OTR Driver', 'Long-haul routes across the continental US. Home time every 2-3 weeks.', 'Dallas, TX', 'OTR', 65000, 75000, ARRAY['CDL-A', '2+ years experience', 'Clean driving record'], ARRAY['Health Insurance', '401k', 'Paid Time Off']),
  ('550e8400-e29b-41d4-a716-446655440102', 'Local Driver', 'Local delivery routes within Houston metro area. Home daily.', 'Houston, TX', 'Local', 55000, 60000, ARRAY['CDL-A', '1+ years experience'], ARRAY['Health Insurance', 'Dental', 'Vision']),
  ('550e8400-e29b-41d4-a716-446655440103', 'Regional Driver', 'Regional routes covering Texas, Oklahoma, and Louisiana.', 'Austin, TX', 'Regional', 60000, 70000, ARRAY['CDL-A', '3+ years experience', 'HAZMAT'], ARRAY['Health Insurance', '401k', 'Performance Bonus']);

-- Insert applications
INSERT INTO applications (driver_id, job_id, recruiter_id, status, cover_letter, applied_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM job_postings WHERE title = 'OTR Driver'), '550e8400-e29b-41d4-a716-446655440101', 'pending', 'I am very interested in this OTR position and believe my 8 years of experience make me a great fit.', now() - interval '2 days'),
  ('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM job_postings WHERE title = 'Local Driver'), '550e8400-e29b-41d4-a716-446655440102', 'interviewed', 'Local driving is my specialty and I would love to join your team.', now() - interval '5 days'),
  ('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM job_postings WHERE title = 'Regional Driver'), '550e8400-e29b-41d4-a716-446655440103', 'reviewed', 'I have experience in the Texas region and am excited about this opportunity.', now() - interval '3 days');

-- Insert messages
INSERT INTO messages (sender_id, recipient_id, application_id, content, read, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM applications WHERE driver_id = '550e8400-e29b-41d4-a716-446655440001'), 'Hi Michael! I came across your profile and I''m impressed with your 8 years of experience. We have an OTR position that might be perfect for you.', true, now() - interval '2 hours'),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440101', (SELECT id FROM applications WHERE driver_id = '550e8400-e29b-41d4-a716-446655440001'), 'Hello! Thank you for reaching out. I''m definitely interested in learning more about the opportunity.', true, now() - interval '1 hour 45 minutes'),
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM applications WHERE driver_id = '550e8400-e29b-41d4-a716-446655440001'), 'Great! The position offers $70-80k annually, excellent benefits, and home time every 2-3 weeks. You''d be running routes primarily in the Southwest region.', true, now() - interval '1 hour 30 minutes'),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440101', (SELECT id FROM applications WHERE driver_id = '550e8400-e29b-41d4-a716-446655440001'), 'Thanks for reaching out! I''m very interested in the position.', false, now() - interval '10 minutes');

-- Insert interviews
INSERT INTO interviews (recruiter_id, driver_id, application_id, title, description, scheduled_at, duration_minutes, type, status, notes) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM applications WHERE driver_id = '550e8400-e29b-41d4-a716-446655440001'), 'OTR Driver Interview', 'Discuss experience with Southwest routes', now() + interval '1 day', 30, 'video', 'scheduled', 'Discuss experience with Southwest routes'),
  ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM applications WHERE driver_id = '550e8400-e29b-41d4-a716-446655440002'), 'Local Driver Interview', 'Review local driving experience', now() + interval '2 days', 45, 'phone', 'scheduled', 'Review reefer experience and availability'),
  ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM applications WHERE driver_id = '550e8400-e29b-41d4-a716-446655440003'), 'Regional Driver Interview', 'Discuss regional routes experience', now() - interval '1 day', 30, 'video', 'completed', 'Great interview, moving to next round');

-- Insert contact unlocks
INSERT INTO contact_unlocks (recruiter_id, driver_id, unlocked_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', now() - interval '2 days'),
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440002', now() - interval '5 days'),
  ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440002', now() - interval '3 days'),
  ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440003', now() - interval '1 day');

-- Insert analytics events
INSERT INTO analytics_events (user_id, event_type, event_data) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', 'candidate_search', '{"filters": {"location": "Texas", "experience": "5+"}}'),
  ('550e8400-e29b-41d4-a716-446655440101', 'contact_unlock', '{"driver_id": "550e8400-e29b-41d4-a716-446655440001"}'),
  ('550e8400-e29b-41d4-a716-446655440101', 'message_sent', '{"recipient_id": "550e8400-e29b-41d4-a716-446655440001"}'),
  ('550e8400-e29b-41d4-a716-446655440102', 'candidate_search', '{"filters": {"location": "Arizona", "license": "CDL-A"}}'),
  ('550e8400-e29b-41d4-a716-446655440102', 'interview_scheduled', '{"driver_id": "550e8400-e29b-41d4-a716-446655440002"}}');