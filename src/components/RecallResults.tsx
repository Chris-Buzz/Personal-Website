import { RECALL } from '../data/content';
import { Icon } from './IconSprite';

/** The recall test: the headline change, then every strategy on the same 36 cases. */
export default function RecallResults() {
  return (
    <>
      <p className="prose-lead">
        Before tuning anything I wrote a test set of {RECALL.questions} real questions, each paired with the notes that
        should answer it, plus {RECALL.unrelated} unrelated prompts that should return nothing.
      </p>

      <div>
        <div className="recall-hero" aria-label={`Hit in the top 4 went from ${RECALL.before} to ${RECALL.after}`}>
          <span className="from">{RECALL.before}</span>
          <Icon name="arrow" className="arrow" />
          <span className="to">{RECALL.after}</span>
        </div>
        <p className="fine">
          Hybrid recall, hit in the top 4, before and after adding date and tool awareness. Measured {RECALL.measured}.
        </p>
      </div>

      <p className="prose-lead">
        Every miss was a question about a time or a tool, like what happened on a given day or what I asked Codex. No
        embedding can answer that, so the fix was a filter on each note’s date and source, not a bigger model.
      </p>

      <table className="recall-table">
        <caption>
          All four strategies with date and tool filters, re-run on the current vault on {RECALL.rerun}. MRR rewards
          putting the right note first, and 1.0 is perfect.
        </caption>
        <thead>
          <tr>
            <th scope="col">Strategy</th>
            <th className="bar-cell" aria-hidden="true" />
            <th scope="col" className="num-col">Top 4</th>
            <th scope="col" className="num-col">MRR</th>
          </tr>
        </thead>
        <tbody>
          {RECALL.rows.map((r) => (
            <tr key={r.name}>
              <td className="strategy">
                <b>
                  {r.name}
                  {r.chosen && <span className="chosen-tag">In use</span>}
                </b>
                <small>{r.detail}</small>
              </td>
              <td className="bar-cell" aria-hidden="true">
                <div className="bar" data-chosen={!!r.chosen} style={{ width: `${r.hit}%` }} />
              </td>
              <td className="num-col">{r.hit}%</td>
              <td className="num-col">{r.mrr.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="fine">
        The auto-recall hook surfaced an expected note for {RECALL.hookFound} of questions and raised {RECALL.hookFalseAlarms}{' '}
        false alarms on the unrelated prompts.
      </p>
    </>
  );
}
