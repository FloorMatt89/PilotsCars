-- =============================================================================
-- PilotCars — Migration 0002
-- Add image_storage_path column to vehicles table.
-- Stores the object key in the vehicles-images storage bucket.
-- Signed URLs are generated server-side; the bucket is never public.
-- =============================================================================

alter table public.vehicles
  add column if not exists image_storage_path text;

comment on column public.vehicles.image_storage_path is
  'Path (object key) in the private vehicles-images storage bucket. Not a public URL. '
  'Example: "vehicles/sedan/nissan-versa-001.jpg"';

-- =============================================================================
-- STORAGE: vehicles-images bucket (private)
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('vehicles-images', 'vehicles-images', false)
on conflict (id) do nothing;

-- Authenticated users can read vehicle images (for browsing the fleet).
create policy "vehicles_images_select_authenticated"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'vehicles-images');

-- Only admins can upload/update/delete vehicle images.
create policy "vehicles_images_write_admin"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'vehicles-images'
    and public.is_admin()
  );

create policy "vehicles_images_update_admin"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'vehicles-images'
    and public.is_admin()
  );

create policy "vehicles_images_delete_admin"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'vehicles-images'
    and public.is_admin()
  );
