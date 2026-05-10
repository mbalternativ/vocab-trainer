# Vocab Trainer

Scaffold for an expandable English vocabulary trainer built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Included

- App Router structure with route groups
- Dashboard, vocabulary, detail, training, import, progress, and admin pages
- Supabase browser/server setup
- Domain-oriented services and types
- Basic training engine and pronunciation fallback via browser TTS
- API route placeholders for progress, imports, and audio resolution
- Server action placeholders for vocabulary, training, progress, and imports
- Demo fallback data so the UI is usable before the database is connected

## Setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Copy environment variables
   ```bash
   cp .env.example .env.local
   ```
3. Fill in your Supabase values in `.env.local`
4. Start the dev server
   ```bash
   npm run dev
   ```

## Next recommended steps

1. Apply the SQL migrations in Supabase
2. Replace fallback lesson/vocabulary data with live DB queries for all modules
3. Build real import upload + OCR flow
4. Add auth screens and protect app routes where needed
5. Implement write actions for training progress and vocabulary CRUD


## Added in this version

- Typed Supabase table definitions including Insert/Update shapes
- Live lesson and vocabulary queries with fallback data
- Real server-side create/update/delete actions for vocabulary
- Real training answer persistence into `user_progress`, `daily_stats`, and `training_sessions`
- Real import finalization from `import_items` into `vocabulary`
- API routes now call the live services and return real errors


## Added in this version

- Real photo upload via Supabase Storage using a server action
- Import row creation in the `imports` table immediately after upload
- Signed preview URL generation for uploaded photos
- OCR preparation endpoint at `/api/imports/[id]/ocr-prep`
- Recent import job cards in the import UI

### Required environment variables for uploads

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_IMPORTS_BUCKET=import-images
```

The upload flow uses the service role key on the server so the import UI can work before the auth screens are finished.

## Added in this version

- OCR execution endpoint at `/api/imports/[id]/ocr`
- OCR Server Action wired into the import UI
- `ocr.service.ts` with an OCR.space provider and local `OCR_MOCK_TEXT` fallback
- Parser improvements for book-photo text, table-like rows, dashes, equals signs, colons, tabs, and IPA snippets
- Automatic replacement of old `import_items` for the selected import when OCR is rerun
- `imports.ocr_raw_text`, `parse_status`, and `error_message` updates during OCR processing

### OCR environment variables

```bash
OCR_SPACE_API_KEY=
OCR_MOCK_TEXT=
```

Use `OCR_SPACE_API_KEY` for real OCR. During local development you can set `OCR_MOCK_TEXT`, for example:

```bash
OCR_MOCK_TEXT="apple - Apfel\nteacher - Lehrer/in\nschool - Schule"
```

When `OCR_MOCK_TEXT` is set, the app skips the external OCR request and still fills `import_items`, which is useful for testing the full import pipeline without spending OCR quota.
