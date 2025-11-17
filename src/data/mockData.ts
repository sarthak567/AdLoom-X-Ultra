export const mockAppState = {
  session: {
    isAuthenticated: false,
    user: {
      name: 'Guest Builder',
      role: 'viewer',
      email: 'guest@adloom.xyz',
      avatar: 'https://avatars.githubusercontent.com/u/000?v=4',
    },
  },
  wallet: {
    connected: false,
    address: '',
    network: 'Linera Testnet',
  },
  notifications: [
    { id: 1, message: 'Brand OS AI boosted eco creatives by +18% CTR.', timestamp: '2m ago' },
    { id: 2, message: 'Viewer @focusmode repaid 25 $ATTN loan.', timestamp: '10m ago' },
  ],
  payments: [
    { id: 'pay_1', counterparty: 'FluxThreads', amount: '+120 $ATTN', type: 'creator', status: 'settled', timestamp: 'Just now' },
    { id: 'pay_2', counterparty: 'PulseDrip', amount: '-40 $ATTN', type: 'campaign', status: 'pending', timestamp: '5m ago' },
    { id: 'pay_3', counterparty: 'Creator Vault Yield', amount: '+12 $ATTN', type: 'vault', status: 'settled', timestamp: '1h ago' },
  ],
  campaigns: [
    { id: 'camp-alpha', advertiser: 'FluxThreads', budget: 1200, spent: 380, status: 'scaling' },
    { id: 'camp-beta', advertiser: 'PulseDrip', budget: 850, spent: 520, status: 'learning' },
    { id: 'camp-gamma', advertiser: 'EcoModa', budget: 640, spent: 610, status: 'cooldown' },
  ],
  viewerFeed: [
    { id: 1, viewer: '@fluxseer', reward: '+0.22 $ATTN', creator: 'PrimeLabs', channel: 'Immersive AR', score: 812 },
    { id: 2, viewer: '@zenwatcher', reward: '+0.18 $ATTN', creator: 'NovaPod', channel: 'Audio', score: 780 },
  ],
  creatorVaults: [
    { creator: 'PrimeLabs', staked: '1,200 $ATTN', apy: '12%' },
    { creator: 'NovaPod', staked: '950 $ATTN', apy: '10.5%' },
  ],
  brandInstructions: [
    { id: 11, brand: 'FluxThreads', directive: 'Shift 20% budget to Creator Tier S' },
    { id: 12, brand: 'PulseDrip', directive: 'Launch adaptive copy for LATAM microchains' },
  ],
};

export type AppState = typeof mockAppState;

