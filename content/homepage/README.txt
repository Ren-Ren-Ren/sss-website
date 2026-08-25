Homepage hero video(s).

One is picked at random each time the homepage loads. To change the pool:

  - Drop in a new .mp4 or .mov file — it's automatically added as a candidate.
  - Delete a file to remove it from the pool.
  - Any filename works, no need to match "reel-01.mp4" etc.

No code changes needed either way — VideoHero.tsx just reads whatever's
in this folder at request time.
