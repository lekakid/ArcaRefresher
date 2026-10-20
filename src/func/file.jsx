const TEMP_PREFIX = 'ar-download-';
const TEMP_TTL = 10 * 60 * 1000;

export function saveFile(name, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
}

async function clearTempFiles(root) {
  for await (const entryName of root.keys()) {
    if (!entryName.startsWith(TEMP_PREFIX)) continue;

    const createdAt = Number(entryName.slice(TEMP_PREFIX.length).split('-')[0]);
    if (Date.now() - createdAt > TEMP_TTL) {
      await root.removeEntry(entryName).catch(() => {});
    }
  }
}

async function openTempFile() {
  const root = await navigator.storage.getDirectory();
  await clearTempFiles(root).catch(() => {});

  const tempName = `${TEMP_PREFIX}${Date.now()}-${crypto.randomUUID()}`;
  const handle = await root.getFileHandle(tempName, { create: true });
  const writable = await handle.createWritable();
  return { root, tempName, handle, writable };
}

export async function saveStream(name, stream) {
  let temp;
  try {
    temp = await openTempFile();
  } catch (_) {
    saveFile(name, await new Response(stream).blob());
    return;
  }

  try {
    await stream.pipeTo(temp.writable);
  } catch (error) {
    await temp.root.removeEntry(temp.tempName).catch(() => {});
    throw error;
  }
  saveFile(name, await temp.handle.getFile());
}
