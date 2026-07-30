import HiveCanvas from '../graph/HiveCanvas';
import { nodes, edges } from '../data/hive';

export default function Hive() {
  return (
    <div className="page" id="page-hive">
      <div className="hive-top">
        <div className="kicker">Knowledge base</div>
        <h1>
          The <em>Hive.</em>
        </h1>
        <p>Every project, post, skill, and chapter — one living network. Drag to pan, scroll to zoom, click any node to open it.</p>
        <div className="hive-stats">
          <span><b>{nodes.length}</b> nodes</span>
          <span><b>{edges.length}</b> connections</span>
          <span><b>4</b> clusters</span>
        </div>
      </div>
      <HiveCanvas />
    </div>
  );
}
