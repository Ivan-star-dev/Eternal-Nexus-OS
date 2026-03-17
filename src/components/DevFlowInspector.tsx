import { useOrganismFlow } from '@/hooks/useOrganismFlow';

const DevFlowInspector = () => {
  const { verdicts, indexEntries, newsItems } = useOrganismFlow();
  if (!import.meta.env.DEV) return null;
  const latestShared = verdicts[0];
  const latestIndex = indexEntries[0];
  const latestNews = newsItems[0];

  return (
    <aside className="fixed bottom-2 right-2 z-[120] w-[320px] rounded border border-primary/30 bg-black/75 p-2 text-[10px] font-mono text-white/85 backdrop-blur">
      <div className="mb-1 text-primary">DEV FLOW INSPECTOR</div>
      <div className="space-y-1">
        <div>
          <strong>shared:</strong> {latestShared ? `${latestShared.topic} (${latestShared.status})` : '—'}
        </div>
        <div>
          <strong>index:</strong> {latestIndex ? `${latestIndex.title} [${latestIndex.flowTarget}]` : '—'}
        </div>
        <div>
          <strong>news:</strong> {latestNews ? `${latestNews.title}` : '—'}
        </div>
      </div>
    </aside>
  );
};

export default DevFlowInspector;
