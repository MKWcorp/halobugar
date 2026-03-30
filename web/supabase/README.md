# Supabase Setup

## Quick Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note down your Project URL and anon key

2. **Run Migration**
   - Go to Supabase Dashboard → SQL Editor
   - Copy content from `migrations/001_initial_schema.sql`
   - Run the SQL

3. **Update Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## Database Structure

### Tables
| Table | Description |
|-------|-------------|
| `users` | User profiles (linked to auth.users) |
| `therapists` | Therapist details & credentials |
| `services` | Available treatment services |
| `addresses` | User saved addresses |
| `bookings` | Appointment bookings |
| `payments` | Payment transactions |
| `treatment_reports` | Post-session reports |
| `reviews` | User reviews for therapists |

### Auto Features
- **User creation**: Auto-creates profile when user signs up
- **Rating calculation**: Auto-updates therapist rating on new review
- **Session count**: Auto-increments when booking completed
- **Default address**: Ensures only one default per user

### Row Level Security (RLS)
All tables have RLS enabled:
- Users can only access their own data
- Therapists can access their bookings
- Admin has full access
- Public can view verified therapists & active services
