import { useState } from 'react';
import { Search, FileText, BarChart2, ShieldAlert, Download, User, Calendar, HardDrive, CheckCircle2, Clock } from 'lucide-react';
import './Dashboard.css';

interface ReportItem {
  id: string;
  title: string;
  category: string;
  date: string;
  size: string;
  status: 'Completed' | 'Pending';
  creator: string;
  desc: string;
}

const mockReports: ReportItem[] = [
  { id: '1', title: 'Q3 Financial Overview', category: 'Financial', date: '2026-07-20', size: '2.4 MB', status: 'Completed', creator: 'Edwin Antony', desc: 'Comprehensive financial report for the third quarter, outlining revenue, cost structures, and operational margins.' },
  { id: '2', title: 'User Growth Analytics', category: 'Analytics', date: '2026-07-19', size: '4.8 MB', status: 'Completed', creator: 'System Generated', desc: 'Weekly user acquisition, active counts, and retention rate metrics visual analytics.' },
  { id: '3', title: 'Security Audit Log', category: 'Security', date: '2026-07-18', size: '15.2 MB', status: 'Completed', creator: 'System Generated', desc: 'Full log of security authentication attempts, firewall hits, and suspicious activities audit.' },
  { id: '4', title: 'Marketing Campaign ROI', category: 'Marketing', date: '2026-07-15', size: '1.2 MB', status: 'Completed', creator: 'B Anand', desc: 'Return on investment analysis for Q2 digital marketing campaigns across social media channels.' },
  { id: '5', title: 'API Inventory Report', category: 'System', date: '2026-07-14', size: '512 KB', status: 'Pending', creator: 'System Generated', desc: 'Current active backend routes and API documentation status check report.' },
  { id: '6', title: 'Server Load & Performance Check', category: 'System', date: '2026-07-12', size: '8.7 MB', status: 'Completed', creator: 'System Generated', desc: 'Monthly server health, CPU utilization patterns, and database query response times report.' }
];

export function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Financial', 'Analytics', 'Security', 'System', 'Marketing'];

  const filteredReports = mockReports.filter(report => {
    // Category filter
    if (selectedCategory !== 'All' && report.category !== selectedCategory) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = report.title.toLowerCase().includes(query);
      const matchDesc = report.desc.toLowerCase().includes(query);
      const matchCreator = report.creator.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchCreator) return false;
    }

    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Financial': return <BarChart2 size={18} color="#8b5cf6" />;
      case 'Analytics': return <BarChart2 size={18} color="#10b981" />;
      case 'Security': return <ShieldAlert size={18} color="#ef4444" />;
      case 'System': return <HardDrive size={18} color="#6b7280" />;
      default: return <FileText size={18} color="#3b82f6" />;
    }
  };

  return (
    <div className="reports-page-container dashboard-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="tw-parent-card" style={{ background: 'var(--bg-dashboard)', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        
        {/* Search & Filter Toolbar card */}
        <div className="settings-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main, #0f172a)', margin: 0 }}>Reports Directory</h1>
            <p style={{ color: 'var(--text-secondary, #475569)', fontSize: '14px', margin: 0 }}>
              Search and view active business reports
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid ' + (selectedCategory === cat ? 'var(--primary)' : 'var(--border-light)'),
                    backgroundColor: selectedCategory === cat ? 'var(--primary-light)' : '#ffffff',
                    color: selectedCategory === cat ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '300px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search 
                size={16} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  color: 'var(--text-muted, #94a3b8)',
                  pointerEvents: 'none'
                }} 
              />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light, #e2e8f0)',
                  fontSize: '13px',
                  backgroundColor: '#ffffff',
                  color: 'var(--text-main, #0f172a)',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
              />
            </div>
          </div>
        </div>

        {/* Reports Cards Grid card */}
        <div className="settings-card" style={{ padding: '24px' }}>
          {filteredReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
              <FileText size={64} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <h3>No Reports Found</h3>
              <p style={{ marginTop: '8px' }}>Try modifying your search or changing the selected category.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {filteredReports.map(report => (
                <div 
                  key={report.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-light, #e2e8f0)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                  }}
                >
                  <div>
                    {/* Header: Icon & Category label */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-dashboard, #f8fafc)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {getCategoryIcon(report.category)}
                      </div>
                      
                      {/* Status pill */}
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: report.status === 'Completed' ? '#ecfdf5' : '#fef3c7',
                        color: report.status === 'Completed' ? '#10b981' : '#d97706'
                      }}>
                        {report.status === 'Completed' ? (
                          <>
                            <CheckCircle2 size={10} />
                            Completed
                          </>
                        ) : (
                          <>
                            <Clock size={10} />
                            Pending
                          </>
                        )}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main, #0f172a)', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                      {report.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary, #475569)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                      {report.desc}
                    </p>
                  </div>

                  {/* Metadata & Actions footer */}
                  <div style={{ borderTop: '1px solid var(--border-light, #e2e8f0)', paddingTop: '16px', marginTop: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px', fontSize: '11px', color: 'var(--text-secondary, #64748b)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {report.creator}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        <span>{report.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <HardDrive size={12} />
                        <span>{report.size}</span>
                      </div>
                    </div>

                    <button
                      disabled={report.status !== 'Completed'}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-light, #e2e8f0)',
                        backgroundColor: report.status === 'Completed' ? '#ffffff' : '#f8fafc',
                        color: report.status === 'Completed' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: report.status === 'Completed' ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (report.status === 'Completed') {
                          e.currentTarget.style.backgroundColor = 'var(--primary)';
                          e.currentTarget.style.color = '#ffffff';
                          e.currentTarget.style.borderColor = 'var(--primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (report.status === 'Completed') {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.color = 'var(--primary)';
                          e.currentTarget.style.borderColor = 'var(--border-light)';
                        }
                      }}
                    >
                      <Download size={14} />
                      Download Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
