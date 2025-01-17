import {Report} from "../../../hooks/useSocket.ts";


interface SectionViewProps {
  sections: Required<Report>['sections'];
  highlightedRef?: React.RefObject<HTMLDivElement>;
  currentlyHighlightedSection?: Report['currentlyHighlightedSection'];
}

const sectionsMapping = {
  overview: null,
  financialHealth: 'Financial Health',
  liquidityMetrics: 'Liquidity Metrics',
  customerMetrics: 'Customer Metrics',
  revenueMetrics: 'Revenue Metrics',
  burnMetrics: 'Burn Metrics',
  transactionMetrics: 'Transaction Metrics',
};

const SectionsView = ({ sections, highlightedRef, currentlyHighlightedSection }: SectionViewProps) => {
  const renderReportSection = (sectionKey, sectionContent) => {
    if (!sectionContent) return null;
    let description;
    let table;

    if (sectionKey === 'overview') {
      description = sectionContent;
    } else {
      description = sectionContent.description;
      table = sectionContent.table;
    }

    return (




      <div
        key={sectionKey}
        className="report-section"
        ref={sectionKey === currentlyHighlightedSection ? highlightedRef : null}
      >
        {sectionsMapping[sectionKey] ? <h2>{sectionsMapping[sectionKey]}</h2> : null}

        <p className={sectionKey === currentlyHighlightedSection ? 'highlighted' : ''}>
          <span>{description}</span>
        </p>
        {table && (
          <table>
            <thead>
            <tr>
              {(table.headers ?? []).map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
            </thead>
            <tbody>
            {(table.rows ?? []).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {(row ?? []).map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <>
      {sections.overview && renderReportSection('overview', sections.overview)}
      {Object.entries(sections ?? {}).map(
        ([key, content]) => key !== 'overview' && renderReportSection(key, content)
      )}
    </>
  )
}

export default SectionsView;