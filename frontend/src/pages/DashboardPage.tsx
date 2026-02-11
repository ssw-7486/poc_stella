import { Navigation } from '../components/ui/Navigation';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { WorkflowsCard } from '../components/dashboard/WorkflowsCard';

// Mock data - hoisted outside component to prevent recreation on every render
const DASHBOARD_STATS = {
  totalJobs: '1,247',
  successRate: '98.5%',
  avgTime: '2.3s',
};

const MOCK_CUSTOMERS = [
  { name: 'customer1', jobs: 847, percent: 68 },
  { name: 'customer2', jobs: 258, percent: 21 },
  { name: 'customer3', jobs: 142, percent: 11 },
];

const ACTIVE_CUSTOMERS = 3; // Total active customers

const MOCK_JOBS = [
  {
    id: 1247,
    status: 'completed',
    customer: 'customer1',
    type: 'Invoice OCR',
    time: '2 minutes ago',
  },
  {
    id: 1246,
    status: 'processing',
    customer: 'customer1',
    type: 'Receipt Extract',
    time: '5 minutes ago',
  },
  {
    id: 1245,
    status: 'queued',
    customer: 'customer2',
    type: 'Form Validation',
    time: '10 minutes ago',
  },
];

// Current batch data for last 3 customers
const CURRENT_BATCH_BY_CUSTOMER = [
  {
    customer: 'customer1',
    documents: [
      { id: 1247, name: 'Invoice #1247', status: 'completed' },
      { id: 1246, name: 'Receipt #1246', status: 'processing' },
    ],
    progress: 24,
    completed: 12,
    total: 50,
  },
  {
    customer: 'customer2',
    documents: [
      { id: 1245, name: 'Form #1245', status: 'queued' },
      { id: 1244, name: 'Contract #1244', status: 'processing' },
    ],
    progress: 60,
    completed: 30,
    total: 50,
  },
  {
    customer: 'customer3',
    documents: [
      { id: 1243, name: 'Invoice #1243', status: 'completed' },
    ],
    progress: 90,
    completed: 45,
    total: 50,
  },
];

export function DashboardPage() {

  return (
    <div className="min-h-screen bg-card-bg">
      <Navigation />

      {/* Main Content */}
      <main className="p-6">
        {/* Page Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-navy">Welcome, Administrator</h1>
          <p className="text-navy/60 mt-1">Here's what's happening with your workflows today</p>
        </header>

        {/* Top Stats Row - 3 Cards */}
        <section className="grid grid-cols-3 gap-6 mb-6">
          {/* Card 1: System Health with Active Customers */}
          <Card title="System Health">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green rounded-full"></span>
                <span className="text-sm text-navy font-medium">All Systems OK</span>
              </div>
              <div className="text-sm text-navy/60">Job Queue: 142 jobs</div>
              <div className="pt-2 border-t border-navy/10">
                <div className="text-navy/60 text-xs font-medium mb-1">Active Customers</div>
                <div className="text-2xl font-bold text-navy">{ACTIVE_CUSTOMERS}</div>
              </div>
            </div>
          </Card>

          {/* Card 2: Per-Customer Breakdown */}
          <Card title="Per-Customer">
            <div className="space-y-2">
              {MOCK_CUSTOMERS.map((customer) => (
                <div key={customer.name} className="flex items-center justify-between text-sm">
                  <span className="text-navy font-medium">{customer.name}</span>
                  <span className="text-navy/60">{customer.percent}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Card 3: Combined Stats (Total Jobs, Accuracy Rate, Avg Time) */}
          <Card title="Processing Stats">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-navy/60 text-xs font-medium">Total Jobs</span>
                <span className="text-xl font-bold text-navy">{DASHBOARD_STATS.totalJobs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-navy/60 text-xs font-medium">Accuracy Rate</span>
                <span className="text-xl font-bold text-green">{DASHBOARD_STATS.successRate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-navy/60 text-xs font-medium">Avg Time</span>
                <span className="text-xl font-bold text-blue">{DASHBOARD_STATS.avgTime}</span>
              </div>
            </div>
          </Card>
        </section>

        {/* Current Batch by Customer - Full Width */}
        <section className="mb-6">
          <Card title="Current Batch - Last 3 Customers">
            <div className="grid grid-cols-3 gap-6">
              {CURRENT_BATCH_BY_CUSTOMER.map((batch) => (
                <div key={batch.customer} className="space-y-3">
                  {/* Customer Header */}
                  <div className="pb-2 border-b border-navy/10">
                    <h3 className="text-sm font-semibold text-navy">{batch.customer}</h3>
                    <div className="text-xs text-navy/60 mt-1">
                      Processing: {batch.completed} of {batch.total}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-2 bg-navy/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue" style={{ width: `${batch.progress}%` }}></div>
                    </div>
                    <div className="text-xs text-navy/60">{batch.progress}% complete</div>
                  </div>

                  {/* Documents Being Processed */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-navy/60 uppercase">Documents</div>
                    <ul className="space-y-1.5">
                      {batch.documents.map((doc) => (
                        <li key={doc.id} className="flex items-center gap-2 text-xs">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            doc.status === 'completed' ? 'bg-green' :
                            doc.status === 'processing' ? 'bg-blue' :
                            'bg-navy/30'
                          }`}></span>
                          <span className="text-navy">{doc.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Workflows Section - Full Width */}
        <section className="mb-6">
          <WorkflowsCard />
        </section>

        {/* Job List - Full Width */}
        <section>
            <Card>
              {/* Header with Filters */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-navy">Job List</h2>
                <div className="flex items-center gap-2">
                  <select
                    className="pl-3 pr-10 py-1.5 text-sm border border-input-border bg-input-section-bg text-navy rounded-md appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2307464C' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.75rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.25em 1.25em'
                    }}
                  >
                    <option>All Status</option>
                    <option>Completed</option>
                    <option>Processing</option>
                    <option>Queued</option>
                  </select>
                  <select
                    className="pl-3 pr-10 py-1.5 text-sm border border-input-border bg-input-section-bg text-navy rounded-md appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2307464C' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.75rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.25em 1.25em'
                    }}
                  >
                    <option>All Customers</option>
                    <option>customer1</option>
                    <option>customer2</option>
                    <option>customer3</option>
                  </select>
                  <button className="p-1.5 hover:bg-navy/5 rounded-md transition-colors">
                    <svg className="w-5 h-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Job List Items - Condensed Single Line with Fixed Status Width */}
              <div className="space-y-2">
                {MOCK_JOBS.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center gap-3 px-4 py-2 border border-navy/10 rounded-md hover:border-blue/30 hover:bg-blue/5 transition-all cursor-pointer"
                  >
                    {/* Expand Icon */}
                    <button className="p-1 text-navy/40 hover:text-navy transition-colors flex-shrink-0">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* Job Info - All on One Line with Fixed Status Width */}
                    <div className="flex items-center gap-3 flex-1 text-sm">
                      <span className="font-semibold text-navy w-20 flex-shrink-0">Job #{job.id}</span>
                      <span className="text-navy/40">|</span>
                      <div className="w-28 flex-shrink-0">
                        <Badge
                          variant={
                            job.status === 'completed'
                              ? 'success'
                              : job.status === 'processing'
                              ? 'info'
                              : 'neutral'
                          }
                        >
                          {job.status === 'completed' && '● Completed'}
                          {job.status === 'processing' && '● Processing'}
                          {job.status === 'queued' && '○ Queued'}
                        </Badge>
                      </div>
                      <span className="text-navy/40">|</span>
                      <span className="text-navy/60 w-24 flex-shrink-0">{job.customer}</span>
                      <span className="text-navy/40">|</span>
                      <span className="text-navy/60 flex-1">{job.type}</span>
                      <span className="text-navy/40">|</span>
                      <span className="text-navy/40 text-xs w-28 flex-shrink-0 text-right">{job.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button - Smaller */}
              <div className="mt-4 text-center">
                <Button variant="outline" className="text-sm px-4 py-1.5">View All Jobs →</Button>
              </div>
            </Card>
        </section>
      </main>
    </div>
  );
}
