Cloudinary / Images Guide

We removed direct Cloudinary integration from the frontend to keep the project clean.

When you're ready to add images (profile pictures, hero assets):

1) Prepare assets
   - Put hero/illustration images inside `public/images/`.
   - Use meaningful filenames (e.g., `hero-dog.png`, `hero-cat.png`, `avatar-placeholder.png`).

2) If you want server-mediated uploads later
   - I'll re-add the server route and `ImageUpload` component.
   - You'll need Cloudinary API keys added to `.env.local`:
     CLOUDINARY_CLOUD_NAME=...
     CLOUDINARY_API_KEY=...
     CLOUDINARY_API_SECRET=...

3) If you prefer direct unsigned uploads (client -> Cloudinary)
   - Create an unsigned upload preset in Cloudinary (Settings → Upload → Upload presets).
   - Add `NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET` and `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` to `.env.local`.
   - I'll patch `ImageUpload` to POST directly to Cloudinary when you ask.

4) Tell me when you want me to re-enable uploads and whether you want server-side or direct unsigned client uploads.

