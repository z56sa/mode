async function checkStatic() {
  const modIds = [
    { game: 'mountandblade2bannerlord', id: 2006 },
    { game: 'mountandblade2bannerlord', id: 4 },
    { game: 'cyberpunk2077', id: 107 },
    { game: 'witcher3', id: 1021 },
    { game: 'skyrimspecialedition', id: 12604 }
  ];

  // Let's test Nexus static delivery or mod image formats
  // Often staticdelivery.nexusmods.com or images.nexusmods.com
  const testUrls = [
    'https://staticdelivery.nexusmods.com/mods/3174/images/2006/2006-1598282367-123456789.png',
  ];
}
