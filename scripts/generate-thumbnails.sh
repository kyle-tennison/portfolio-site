#!/usr/bin/env zsh
# Generates thumbnails (q60 webp) for any photos in src/photography that don't
# already have a corresponding file in their thumbnails/ subdir.
# Also auto-converts any JPEGs to webp (q92) and removes the original.
# Usage: ./scripts/generate-thumbnails.sh
#
# Generated with Claude Sonnet 4.6 (claude-sonnet-4-6)

setopt NULL_GLOB  # Don't error on unmatched globs

SCRIPT_DIR="${0:A:h}"
PHOTOS_DIR="$SCRIPT_DIR/../src/photography"
QUALITY=92
THUMB_QUALITY=60

if ! command -v cwebp &>/dev/null; then
  echo "Error: cwebp not found. Install with: brew install webp"
  exit 1
fi

converted=0
generated=0
skipped=0
pruned=0

for album in "$PHOTOS_DIR"/*/; do
  mkdir -p "$album/thumbnails"

  # Convert any JPEGs to webp first
  for jpeg in "$album"*.jpg "$album"*.jpeg "$album"*.JPG "$album"*.JPEG; do
    [[ -f "$jpeg" ]] || continue

    name=$(basename "${jpeg%.*}")
    webp="$album$name.webp"

    echo "Converting JPEG: $(basename $jpeg) → $name.webp"
    cwebp -q $QUALITY "$jpeg" -o "$webp" 2>/dev/null && rm "$jpeg"
    ((converted++))
  done

  # Generate missing thumbnails for all webps
  for photo in "$album"*.webp; do
    [[ -f "$photo" ]] || continue

    name=$(basename "$photo")
    thumb="$album/thumbnails/$name"

    if [[ -f "$thumb" ]]; then
      ((skipped++))
    else
      echo "Generating thumbnail: $name"
      cwebp -q $THUMB_QUALITY "$photo" -o "$thumb" 2>/dev/null
      ((generated++))
    fi
  done

  # Remove thumbnails that no longer have a corresponding source photo
  for thumb in "$album/thumbnails/"*.webp; do
    [[ -f "$thumb" ]] || continue

    name=$(basename "$thumb")
    source="$album$name"

    if [[ ! -f "$source" ]]; then
      echo "Pruning orphaned thumbnail: $name"
      rm "$thumb"
      ((pruned++))
    fi
  done
done

echo "\nDone — $converted JPEGs converted, $generated thumbnails generated, $skipped already existed, $pruned pruned."
