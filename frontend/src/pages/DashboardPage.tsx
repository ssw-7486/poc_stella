import { Navigation } from '../components/ui/Navigation';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export function DashboardPage() {
  // Mock data
  const stats = {
    totalJobs: '1,247',
    successRate: '98.5%',
    avgTime: '2.3s',
  };

  const customers = [
    { name: 'customer1', jobs: 847, percent: 68 },
    { name: 'customer2', jobs: 258, percent: 21 },
    { name: 'customer3', jobs: 142, percent: 11 },
  ];

  const jobs = [
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

  const recentActivity = [
    { id: 1247, name: 'Invoice #1247' },
    { id: 1246, name: 'Receipt #1246' },
    { id: 1243, name: 'Form #1243' },
  ];

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

        {/* Stats Grid */}
        <section className="grid grid-cols-4 gap-4 mb-6">
          {/* Total Jobs */}
          <Card>
            <div className="text-navy/60 text-sm font-medium mb-1">Total Jobs</div>
            <div className="text-3xl font-bold text-navy">{stats.totalJobs}</div>
          </Card>

          {/* Accuracy Rate */}
          <Card>
            <div className="text-navy/60 text-sm font-medium mb-1">Accuracy Rate</div>
            <div className="text-3xl font-bold text-green">{stats.successRate}</div>
          </Card>

          {/* Avg Time */}
          <Card>
            <div className="text-navy/60 text-sm font-medium mb-1">Avg Time</div>
            <div className="text-3xl font-bold text-blue">{stats.avgTime}</div>
          </Card>

          {/* Per-Customer Breakdown */}
          <Card>
            <div className="text-navy/60 text-sm font-medium mb-2">Per-Customer</div>
            <div className="space-y-2">
              {customers.map((customer) => (
                <div key={customer.name} className="flex items-center justify-between text-xs">
                  <span className="text-navy font-medium">{customer.name}</span>
                  <span className="text-navy/60">{customer.percent}%</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Two-Panel Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Panel: Activity */}
          <section className="space-y-4">
            {/* System Health */}
            <Card title="System Health">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green rounded-full"></span>
                  <span className="text-sm text-navy font-medium">All Systems OK</span>
                </div>
                <div className="text-sm text-navy/60">Queue: 142 jobs</div>
              </div>
            </Card>

            {/* Current Batch */}
            <Card title="Current Batch">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-navy/60">Processing</span>
                  <span className="font-semibold text-navy">12 of 50</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2 bg-navy/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue" style={{ width: '24%' }}></div>
                </div>
                <div className="text-xs text-navy/60">24% complete</div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card title="Recent Activity">
              <ul className="space-y-2">
                {recentActivity.map((item) => (
                  <li key={item.id} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-green rounded-full"></span>
                    <span className="text-navy">{item.name}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* Right Panel: Job List */}
          <section className="col-span-2">
            <Card>
              {/* Header with Filters */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-navy">Job List</h2>
                <div className="flex items-center gap-2">
                  <select className="px-3 py-1.5 text-sm border border-input-border bg-input-section-bg text-navy rounded-md">
                    <option>All Status</option>
                    <option>Completed</option>
                    <option>Processing</option>
                    <option>Queued</option>
                  </select>
                  <select className="px-3 py-1.5 text-sm border border-input-border bg-input-section-bg text-navy rounded-md">
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

              {/* Job List Items */}
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-start gap-3 p-4 border border-navy/10 rounded-md hover:border-blue/30 hover:bg-blue/5 transition-all cursor-pointer"
                  >
                    {/* Expand Icon */}
                    <button className="mt-1 text-navy/40 hover:text-navy">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-navy">Job #{job.id}</span>
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
                      <div className="text-sm text-navy/60">
                        {job.customer} | {job.type}
                      </div>
                      <div className="text-xs text-navy/40 mt-1">{job.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <div className="mt-4 text-center">
                <Button variant="outline">View All Jobs →</Button>
              </div>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
