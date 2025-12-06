// Mock data service - Replace these API calls with your RPC node endpoints

export interface NodeData {
  id: string;
  name: string;
  pubKey: string;
  voteAccount: string;
  website: string;
  apy: number;
  voteSuccessRate: number;
  stakeHistory: { epoch: number; stake: number }[];
  version: string;
  uptimeScore: number;
  storageCapacity: number; // in GB
  ipAddress: string;
  country: string;
  countryCode: string;
  status: 'active' | 'delinquent';
  latitude: number;
  longitude: number;
  lastSeen: string;
  gossipData: Record<string, unknown>;
}

export interface NetworkStats {
  totalActiveNodes: number;
  totalNodes: number;
  totalStorage: number; // in TB
  currentEpoch: number;
  blockHeight: number;
  averageLatency: number; // in ms
}

// Generate mock nodes with realistic data
const generateMockNodes = (): NodeData[] => {
  const countries = [
    { name: 'United States', code: 'US', lat: 37.0902, lng: -95.7129 },
    { name: 'Germany', code: 'DE', lat: 51.1657, lng: 10.4515 },
    { name: 'Japan', code: 'JP', lat: 36.2048, lng: 138.2529 },
    { name: 'Singapore', code: 'SG', lat: 1.3521, lng: 103.8198 },
    { name: 'Netherlands', code: 'NL', lat: 52.1326, lng: 5.2913 },
    { name: 'France', code: 'FR', lat: 46.2276, lng: 2.2137 },
    { name: 'United Kingdom', code: 'GB', lat: 55.3781, lng: -3.436 },
    { name: 'Canada', code: 'CA', lat: 56.1304, lng: -106.3468 },
    { name: 'Australia', code: 'AU', lat: -25.2744, lng: 133.7751 },
    { name: 'Brazil', code: 'BR', lat: -14.235, lng: -51.9253 },
    { name: 'South Korea', code: 'KR', lat: 35.9078, lng: 127.7669 },
    { name: 'India', code: 'IN', lat: 20.5937, lng: 78.9629 },
  ];

  const versions = ['1.18.22', '1.18.21', '1.18.20', '1.17.34'];
  
  const nodeNames = [
    'Xandeum Alpha', 'Nexus Prime', 'Quantum Node', 'Stellar Forge', 'Dark Matter',
    'Hyperion', 'Nebula Core', 'Titan Gate', 'Aurora Borealis', 'Phoenix Rising',
    'Orion Belt', 'Galaxy Seed', 'Nova Burst', 'Cosmic Ray', 'Solar Flare',
    'Black Hole', 'Meteor Strike', 'Comet Trail', 'Asteroid Belt', 'Pulsar Beam',
    'Supernova', 'Red Giant', 'White Dwarf', 'Neutron Star', 'Quasar Light',
    'Wormhole', 'Event Horizon', 'Singularity', 'Dark Energy', 'Antimatter',
    'Gravity Well', 'Time Dilation', 'Space Fold', 'Void Walker', 'Star Dust',
    'Moon Shadow', 'Sun Spot', 'Ring World', 'Dyson Sphere', 'Kardashev Prime',
    'Entropy Node', 'Fusion Core', 'Plasma Drive', 'Ion Storm', 'Photon Grid',
    'Electron Cloud', 'Proton Chain', 'Neutrino Flow', 'Quark Spin', 'Boson Field'
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const isActive = Math.random() > 0.15;
    const pubKey = generatePubKey();
    const voteAccount = generatePubKey();

    return {
      id: `node-${i + 1}`,
      name: nodeNames[i] || `Node ${i + 1}`,
      pubKey,
      voteAccount,
      website: `https://${nodeNames[i]?.toLowerCase().replace(/\s+/g, '') || `node${i + 1}`}.xandeum.io`,
      apy: isActive ? 5 + Math.random() * 8 : 0,
      voteSuccessRate: isActive ? 85 + Math.random() * 15 : 20 + Math.random() * 40,
      stakeHistory: Array.from({ length: 10 }, (_, j) => ({
        epoch: 513 + j,
        stake: Math.floor(50000 + Math.random() * 200000),
      })),
      version: versions[Math.floor(Math.random() * versions.length)],
      uptimeScore: isActive ? 85 + Math.random() * 15 : 20 + Math.random() * 40,
      storageCapacity: Math.floor(100 + Math.random() * 900),
      ipAddress: generateIP(),
      country: country.name,
      countryCode: country.code,
      status: isActive ? 'active' : 'delinquent',
      latitude: country.lat + (Math.random() - 0.5) * 10,
      longitude: country.lng + (Math.random() - 0.5) * 10,
      lastSeen: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      gossipData: generateGossipData(pubKey, isActive),
    };
  });
};

const generatePubKey = (): string => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  return Array.from({ length: 44 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const generateIP = (): string => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

const generateGossipData = (pubKey: string, isActive: boolean) => ({
  node_pubkey: pubKey,
  gossip_port: 8001,
  tpu_port: 8003,
  tpu_forwards_port: 8004,
  tvu_port: 8000,
  serve_repair_port: 8002,
  shred_version: 50093,
  feature_set: 4215500110,
  rpc_host: isActive ? '127.0.0.1:8899' : null,
  pubsub_host: isActive ? '127.0.0.1:8900' : null,
  wallclock: Date.now(),
  contact_info_version: 2,
});

// Cache nodes to maintain consistency across refreshes (simulating real data)
let cachedNodes: NodeData[] | null = null;

// Placeholder API functions - Replace with your RPC calls
export const fetchNodes = async (): Promise<NodeData[]> => {
  // TODO: Replace with your RPC endpoint
  // const response = await fetch('YOUR_RPC_ENDPOINT/getClusterNodes');
  // return response.json();

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!cachedNodes) {
    cachedNodes = generateMockNodes();
  }

  // Simulate minor updates on each refresh
  cachedNodes = cachedNodes.map((node) => ({
    ...node,
    uptimeScore: Math.max(0, Math.min(100, node.uptimeScore + (Math.random() - 0.5) * 2)),
    lastSeen: node.status === 'active' ? new Date().toISOString() : node.lastSeen,
  }));

  return cachedNodes;
};

export const fetchNetworkStats = async (): Promise<NetworkStats> => {
  // TODO: Replace with your RPC endpoint
  // const response = await fetch('YOUR_RPC_ENDPOINT/getNetworkStats');
  // return response.json();

  await new Promise((resolve) => setTimeout(resolve, 300));

  const nodes = await fetchNodes();
  const activeNodes = nodes.filter((n) => n.status === 'active');

  return {
    totalActiveNodes: activeNodes.length,
    totalNodes: nodes.length,
    totalStorage: nodes.reduce((acc, n) => acc + n.storageCapacity, 0) / 1024,
    currentEpoch: 523 + Math.floor(Math.random() * 5),
    blockHeight: 245892341 + Math.floor(Math.random() * 1000),
    averageLatency: 45 + Math.random() * 30,
  };
};

export const fetchNodeById = async (id: string): Promise<NodeData | null> => {
  const nodes = await fetchNodes();
  return nodes.find((n) => n.id === id) || null;
};
