// Predefined benchmark dataset for consistent testing
export const BENCHMARK_QUERIES = [
  {
    id: 'tech-1',
    category: 'technical',
    query: 'Explain how quantum entanglement enables quantum computing and its current limitations in practical applications.',
  },
  {
    id: 'stat-1',
    category: 'statistical',
    query: 'What percentage of global energy consumption comes from renewable sources, and how has this changed over the past decade?',
  },
  {
    id: 'fact-1',
    category: 'factual',
    query: 'What is the distance from Earth to Mars, and how long does it take for light to travel between them?',
  },
  {
    id: 'multi-1',
    category: 'multi-claim',
    query: 'The human brain contains approximately 86 billion neurons. Each neuron can form thousands of synaptic connections. This creates a network more complex than the internet.',
  },
  {
    id: 'tech-2',
    category: 'technical',
    query: 'How does CRISPR gene editing work, and what are the ethical implications of using it on human embryos?',
  },
  {
    id: 'stat-2',
    category: 'statistical',
    query: 'What is the current global population, and at what rate is it projected to grow by 2050?',
  },
  {
    id: 'fact-2',
    category: 'factual',
    query: 'What is the speed of light in a vacuum, and why is it considered a universal constant?',
  },
  {
    id: 'multi-2',
    category: 'multi-claim',
    query: 'Artificial intelligence systems can now generate realistic images, write coherent text, and even compose music. These capabilities raise questions about creativity and authorship.',
  },
]

export function getRandomBenchmarkQuery() {
  return BENCHMARK_QUERIES[Math.floor(Math.random() * BENCHMARK_QUERIES.length)]
}

export function getBenchmarkQueryById(id: string) {
  return BENCHMARK_QUERIES.find(q => q.id === id)
}
