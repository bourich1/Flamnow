-- ====================================================================
-- PostgreSQL Trigger: Auto-Link Admin Users
-- Best Practice Method: Automatically links newly registered users
-- in auth.users to the public.admins table if they meet conditions.
-- ====================================================================

-- 1. Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_admin()
RETURNS TRIGGER AS $$
BEGIN
    -- CONDITION A: Auto-promote the FIRST user registered in the system.
    -- CONDITION B: Auto-promote any user registering with an email containing "@flamnow.com"
    IF (SELECT COUNT(*) FROM auth.users) <= 1 OR NEW.email LIKE '%@flamnow.com' THEN
        INSERT INTO public.admins (id, email)
        VALUES (NEW.id, NEW.email)
        ON CONFLICT (id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Bind the trigger to auth.users (runs after every registration)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin();
