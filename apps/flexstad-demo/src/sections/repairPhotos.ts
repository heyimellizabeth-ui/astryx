// Copyright (c) Meta Platforms, Inc. and affiliates.

/** At most this many photos go with one repair report (the endpoint agrees). */
export const MAX_REPAIR_PHOTOS = 5;

/** A phone photo can be large; this only stops absurd files being read. */
export const MAX_ORIGINAL_BYTES = 25 * 1024 * 1024;

const LONGEST_SIDE = 1600;
const JPEG_QUALITY = 0.82;

/** A photo that could not be read, so the form can name it. */
export class UnreadablePhotoError extends Error {
  readonly fileName: string;

  constructor(fileName: string) {
    super(`Could not read ${fileName}`);
    this.fileName = fileName;
  }
}

/**
 * Shrinks one photo to at most 1600px on its longest side and saves it as a
 * JPEG. A phone photo of several megabytes becomes a few hundred kilobytes,
 * so the upload is quick on mobile data. Drawing it on a canvas also drops
 * everything stored inside the file, including the location it was taken at,
 * and turns it the right way up.
 */
export async function preparePhoto(file: File, index: number): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: 'from-image',
    });
    const scale = Math.min(
      1,
      LONGEST_SIDE / Math.max(bitmap.width, bitmap.height),
    );
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('no canvas');
    }
    // A PNG with transparency would turn black as a JPEG: paint white first.
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
    );
    if (!blob) {
      throw new Error('no blob');
    }
    return new File([blob], `foto-${index + 1}.jpg`, {type: 'image/jpeg'});
  } catch {
    throw new UnreadablePhotoError(file.name);
  }
}

/** Prepares every photo, in order; the first unreadable one stops it. */
export async function preparePhotos(
  files: ReadonlyArray<File>,
): Promise<File[]> {
  const prepared: File[] = [];
  for (const [index, file] of files.entries()) {
    prepared.push(await preparePhoto(file, index));
  }
  return prepared;
}
