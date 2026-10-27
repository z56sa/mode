const testIds = [
  '128093075', // M9K Small Arms
  '2131186647', // ArcCW Base
  '771487490', // simfphys base
  '1595194095', // Helm's Deep Fixed L4D2
  '1646203073', // Chernobyl L4D2
  '1510950729', // Filibuster Rhymes
  '2487022075', // True Actions PZ
  '2824688872', // Recipe Browser Terraria
  '2669644269', // Boss Checklist Terraria
  '2070064141', // Fargo's Mutant Terraria
];

async function checkDetails() {
  const params = new URLSearchParams({ itemcount: String(testIds.length) });
  testIds.forEach((id, idx) => params.append(`publishedfileids[${idx}]`, id));

  const res = await fetch('https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/', {
    method: 'POST',
    body: params
  });
  const data = await res.json();
  const details = data.response?.publishedfiledetails || [];

  for (const d of details) {
    console.log(`[${d.publishedfileid}] "${d.title}" -> ${d.preview_url ? 'OK: ' + d.preview_url.substring(0, 60) : 'NO PREVIEW'}`);
  }
}

checkDetails();
