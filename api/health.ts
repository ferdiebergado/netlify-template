type Health = {
  nodeVersion: string;
};

export function getHealth(): Health {
  return { nodeVersion: process.version };
}
