/*
# [Function: get_my_role]
This function retrieves the role of the currently authenticated user from the 'profiles' table.

## Query Description: 
This function is defined with `SECURITY DEFINER` privileges. This means it runs as the user who defined it (typically a superuser), bypassing any Row Level Security (RLS) policies on the `profiles' table. This is a secure and standard way to fetch specific user data without running into RLS conflicts, such as the "infinite recursion" error you were experiencing. The function is designed to be called only by authenticated users.

## Metadata:
- Schema-Category: ["Safe", "Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true (you can drop the function)

## Structure Details:
- Function Name: get_my_role
- Returns: TEXT (the user's role)

## Security Implications:
- RLS Status: Bypassed due to `SECURITY DEFINER`.
- Policy Changes: No.
- Auth Requirements: The function checks that `auth.uid()` is not null, meaning only authenticated users can call it. It only returns the role for the *calling user*, so one user cannot see another's role.

## Performance Impact:
- Indexes: Uses the primary key index on the `profiles` table for fast lookups.
- Triggers: None.
- Estimated Impact: Negligible performance impact.
*/
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN (SELECT role FROM profiles WHERE id = auth.uid());
END;
$$;
