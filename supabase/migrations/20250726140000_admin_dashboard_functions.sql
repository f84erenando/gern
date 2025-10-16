/*
# [Admin Dashboard Functions]
This migration adds the necessary database columns and functions to power the Admin Dashboard. It includes adding a 'status' column to profiles and creating secure RPC functions for admins to fetch user data and perform management actions.

## Query Description: [This operation enhances the 'profiles' table and adds several secure functions for administrative purposes. It is designed to be non-destructive.]

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Adds column `status` to `public.profiles`.
- Creates function `get_total_users_count()`.
- Creates function `get_all_users()`.
- Creates function `update_user_role(target_user_id uuid, new_role text)`.
- Creates function `update_user_status(target_user_id uuid, new_status text)`.

## Security Implications:
- RLS Status: Unchanged for table, but functions are SECURITY DEFINER.
- Policy Changes: No.
- Auth Requirements: The new functions perform checks to ensure only users with the 'admin' role can execute them successfully.

## Performance Impact:
- Indexes: None.
- Triggers: None.
- Estimated Impact: Low. The functions are simple lookups.
*/

-- 1. Add status to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';

-- 2. Function to get total users count (admin only)
CREATE OR REPLACE FUNCTION get_total_users_count()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_role TEXT;
  total_users INT;
BEGIN
  -- Check if the caller is an admin
  SELECT role INTO caller_role FROM profiles WHERE id = auth.uid();
  IF caller_role <> 'admin' THEN
    RAISE EXCEPTION 'Permission denied: You must be an admin to perform this action.';
  END IF;

  -- Count users
  SELECT count(*) INTO total_users FROM auth.users;
  RETURN total_users;
END;
$$;

-- 3. Function to get all users (admin only)
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  email TEXT,
  role TEXT,
  status TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    caller_role TEXT;
BEGIN
    -- Check if the caller is an admin
    SELECT role INTO caller_role FROM profiles WHERE id = auth.uid();
    IF caller_role <> 'admin' THEN
        RAISE EXCEPTION 'Permission denied: You must be an admin to perform this action.';
    END IF;

    RETURN QUERY
    SELECT
        u.id,
        p.full_name,
        u.email,
        p.role,
        p.status,
        u.created_at
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id;
END;
$$;


-- 4. Function to update a user's role (admin only)
CREATE OR REPLACE FUNCTION update_user_role(target_user_id UUID, new_role TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_role TEXT;
BEGIN
  -- Check if the caller is an admin
  SELECT role INTO caller_role FROM profiles WHERE id = auth.uid();
  IF caller_role <> 'admin' THEN
    RAISE EXCEPTION 'Permission denied: You must be an admin to perform this action.';
  END IF;

  -- Prevent admin from changing their own role
  IF auth.uid() = target_user_id THEN
    RAISE EXCEPTION 'Admins cannot change their own role.';
  END IF;

  -- Update the target user's role
  UPDATE profiles
  SET role = new_role
  WHERE id = target_user_id;
END;
$$;

-- 5. Function to update a user's status (admin only)
CREATE OR REPLACE FUNCTION update_user_status(target_user_id UUID, new_status TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_role TEXT;
BEGIN
  -- Check if the caller is an admin
  SELECT role INTO caller_role FROM profiles WHERE id = auth.uid();
  IF caller_role <> 'admin' THEN
    RAISE EXCEPTION 'Permission denied: You must be an admin to perform this action.';
  END IF;

  -- Prevent admin from blocking themselves
  IF auth.uid() = target_user_id AND new_status = 'Bloqueado' THEN
      RAISE EXCEPTION 'Admins cannot block themselves.';
  END IF;

  -- Update the target user's status
  UPDATE profiles
  SET status = new_status
  WHERE id = target_user_id;
END;
$$;
