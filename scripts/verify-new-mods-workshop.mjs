const items = [
  // Garry's Mod
  { id: '160250458', name: 'Wiremod' },
  { id: '2840031720', name: 'TFA Base' },
  { id: '128093100', name: 'M9K Small Arms' },
  { id: '184918719', name: 'Stop it Slender' },
  { id: '884033111', name: 'Simfphys Vehicles' },
  { id: '2128718018', name: 'ArcCW Base' },
  
  // Left 4 Dead 2
  { id: '3022416274', name: 'Left 4 Bots 2' },
  { id: '121086524', name: 'Urban Flight' },
  { id: '2031028789', name: 'Glubtastic' },
  { id: '121069410', name: 'I Hate Mountains 2' },
  { id: '128428201', name: 'Suicide Blitz 2' },

  // Project Zomboid
  { id: '2200148440', name: "Brita's Weapon Pack" },
  { id: '2875848298', name: 'Common Sense' },

  // RimWorld
  { id: '2890901044', name: 'Combat Extended' },
  { id: '2009463077', name: 'Harmony (RimWorld)' },
  { id: '735106432', name: 'EdB Prepare Carefully' },
  { id: '2023507013', name: 'Vanilla Expanded Framework' },
  { id: '1423699208', name: 'Wall Light' },

  // Terraria
  { id: '2824688072', name: 'Calamity Mod' },
  { id: '2824688266', name: 'Calamity Music' },
  { id: '2563309347', name: 'Magic Storage' },
  { id: '2670732529', name: 'Boss Checklist' },
  { id: '2619073099', name: 'Recipe Browser' },
  { id: '2996924978', name: "Fargo's Mutant Mod" },

  // Cities Skylines
  { id: '1637663252', name: 'TM:PE Traffic Manager' },
  { id: '1619685021', name: 'Move It' },
  { id: '2858591409', name: 'Loading Screen Mod' },
  { id: '2560782729', name: 'Network Multitool' },
  { id: '2472062376', name: 'Node Controller' }
];

async function checkWorkshopDetails() {
  const ids = items.map(x => x.id);
  const params = new URLSearchParams({ itemcount: String(ids.length) });
  ids.forEach((id, idx) => params.append(`publishedfileids[${idx}]`, id));

  const res = await fetch('https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/', {
    method: 'POST',
    body: params
  });
  const data = await res.json();
  const details = data.response?.publishedfiledetails || [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const d = details.find(x => x.publishedfileid === item.id);
    console.log(`[${item.name}] ID:${item.id} -> Title: "${d?.title}" | Preview: ${d?.preview_url?.substring(0, 60)}...`);
  }
}

checkWorkshopDetails();
