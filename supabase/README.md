# Supabase — removed

The Supabase integration (narrative cache + wrapped_profiles analytics) was removed.
AI narratives are now generated fresh on every request with a built-in retry.

`schema.sql` is kept as a reference in case caching is reintroduced later.
