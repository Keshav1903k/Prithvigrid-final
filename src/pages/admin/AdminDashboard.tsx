import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Inbox,
  Briefcase,
  BookOpen,
  Calculator,
  LogOut,
  RefreshCw,
  Search,
  Clock,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { authAPI, inquiryAPI, estimateAPI, projectAPI } from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({ totalInquiries: 0, newInquiries: 0, totalProjects: 0, totalBlogs: 0 });
  const [activeTab, setActiveTab] = useState<'inquiries' | 'estimator' | 'projects'>('inquiries');

  // Inquiries state
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Estimator state
  const [estimatorInput, setEstimatorInput] = useState({
    builtUpArea: 2400,
    packageType: 'premium' as 'standard' | 'premium' | 'luxury',
    city: 'Delhi NCR',
    floors: 2,
  });
  const [estimateResult, setEstimateResult] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    const currentUser = authAPI.getUser();
    setUser(currentUser);

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      const statsRes = await authAPI.getStats();
      if (statsRes.stats) setStats(statsRes.stats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }

    loadInquiries();
    loadProjects();
  };

  const loadInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await inquiryAPI.getAll({
        status: inquiryStatusFilter === 'all' ? undefined : inquiryStatusFilter,
        search: searchQuery || undefined,
      });
      if (res.data) setInquiries(res.data);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await projectAPI.getAll();
      if (res.data) setProjects(res.data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [inquiryStatusFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await inquiryAPI.updateStatus(id, { status: newStatus });
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === id || inq.id === id ? { ...inq, status: newStatus } : inq))
      );
      // update stats count
      const statsRes = await authAPI.getStats();
      if (statsRes.stats) setStats(statsRes.stats);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await inquiryAPI.delete(id);
      setInquiries((prev) => prev.filter((inq) => inq._id !== id && inq.id !== id));
      const statsRes = await authAPI.getStats();
      if (statsRes.stats) setStats(statsRes.stats);
    } catch (err) {
      alert('Failed to delete inquiry');
    }
  };

  const handleCalculateEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    try {
      const res = await estimateAPI.calculate(estimatorInput);
      setEstimateResult(res.data);
    } catch (err) {
      alert('Calculation failed');
    } finally {
      setCalculating(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/admin/login');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">New</span>;
      case 'contacted':
        return <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">Contacted</span>;
      case 'in_review':
        return <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30">In Review</span>;
      case 'quoted':
        return <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Quoted</span>;
      case 'closed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-gray-500/10 text-gray-400 border border-gray-500/30">Closed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-gray-500/10 text-gray-300">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#ffffff]">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#141414] px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-serif font-bold text-[#ffffff] tracking-wider flex items-center gap-2">
            <span className="text-[#F4A300]">PG</span> PRITHVIGRID
          </Link>
          <span className="hidden md:inline-block px-3 py-1 rounded-md bg-[#0B3C5D] text-[11px] uppercase tracking-widest text-[#F4A300] font-semibold">
            Admin Console
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            className="text-xs text-gray-400 hover:text-[#ffffff] flex items-center gap-1.5 transition-colors hidden sm:flex"
          >
            Live Site <ExternalLink size={12} />
          </Link>
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          <div className="text-right hidden sm:block">
            <div className="text-xs font-medium text-[#ffffff]">{user?.name || 'Administrator'}</div>
            <div className="text-[10px] text-gray-400">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 transition-colors"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-6 md:px-12 py-10">
        {/* KPI Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium">Total Inquiries</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><Inbox size={18} /></div>
            </div>
            <div className="text-3xl font-serif font-bold text-[#ffffff]">{stats.totalInquiries}</div>
            <div className="text-[11px] text-gray-500 mt-2">Client commission requests</div>
          </div>

          <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#F4A300] font-medium">New / Action Needed</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-[#F4A300]"><Clock size={18} /></div>
            </div>
            <div className="text-3xl font-serif font-bold text-[#F4A300]">{stats.newInquiries}</div>
            <div className="text-[11px] text-gray-500 mt-2">Requires engineer response</div>
          </div>

          <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium">Portfolio Projects</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><Briefcase size={18} /></div>
            </div>
            <div className="text-3xl font-serif font-bold text-[#ffffff]">{stats.totalProjects}</div>
            <div className="text-[11px] text-gray-500 mt-2">Active showcase structures</div>
          </div>

          <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium">Published Articles</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400"><BookOpen size={18} /></div>
            </div>
            <div className="text-3xl font-serif font-bold text-[#ffffff]">{stats.totalBlogs}</div>
            <div className="text-[11px] text-gray-500 mt-2">Architectural insights</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 gap-8 mb-8">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-4 text-xs uppercase tracking-[0.2em] font-semibold transition-all relative ${
              activeTab === 'inquiries' ? 'text-[#F4A300]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Inquiries & Leads
            {stats.newInquiries > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-[#F4A300] text-black font-bold">
                {stats.newInquiries}
              </span>
            )}
            {activeTab === 'inquiries' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F4A300]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('estimator')}
            className={`pb-4 text-xs uppercase tracking-[0.2em] font-semibold transition-all relative ${
              activeTab === 'estimator' ? 'text-[#F4A300]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Cost Estimator Tool
            {activeTab === 'estimator' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F4A300]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-4 text-xs uppercase tracking-[0.2em] font-semibold transition-all relative ${
              activeTab === 'projects' ? 'text-[#F4A300]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Projects Registry
            {activeTab === 'projects' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F4A300]" />
            )}
          </button>
        </div>

        {/* TAB 1: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 overflow-x-auto">
                {['all', 'new', 'contacted', 'in_review', 'quoted', 'closed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setInquiryStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-medium capitalize transition-colors ${
                      inquiryStatusFilter === st
                        ? 'bg-[#0B3C5D] text-[#F4A300] border border-[#F4A300]/30 font-bold'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search client or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadInquiries()}
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#F4A300]"
                  />
                </div>
                <button
                  onClick={loadInquiries}
                  className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white border border-white/10 transition-colors"
                  title="Refresh inquiries"
                >
                  <RefreshCw size={14} className={loadingInquiries ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {inquiries.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <Inbox size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No client inquiries found matching current filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Project Type</th>
                      <th className="py-3 px-4">Message / Requirements</th>
                      <th className="py-3 px-4">Received</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {inquiries.map((inq) => (
                      <tr key={inq._id || inq.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-semibold text-[#ffffff] text-sm">{inq.from_name}</div>
                          <div className="text-gray-300">{inq.from_email}</div>
                          {inq.phone && <div className="text-gray-400 text-[11px]">{inq.phone}</div>}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-200">{inq.project_type}</span>
                          {inq.location && <div className="text-gray-500 text-[11px]">{inq.location}</div>}
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          <p className="line-clamp-2 text-gray-300 font-light">{inq.message}</p>
                        </td>
                        <td className="py-4 px-4 text-gray-400 whitespace-nowrap">
                          {new Date(inq.createdAt || Date.now()).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1.5 items-start">
                            {getStatusBadge(inq.status)}
                            <select
                              value={inq.status}
                              onChange={(e) => handleStatusChange(inq._id || inq.id, e.target.value)}
                              className="bg-[#1f1f1f] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#F4A300]"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="in_review">In Review</option>
                              <option value="quoted">Quoted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleDeleteInquiry(inq._id || inq.id)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete inquiry"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ESTIMATOR */}
        {activeTab === 'estimator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-[#141414] border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-[#0B3C5D] text-[#F4A300]">
                  <Calculator size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-white">Cost Breakdown Calculator</h2>
                  <p className="text-gray-400 text-xs">Generate instant client quotes backed by REST API</p>
                </div>
              </div>

              <form onSubmit={handleCalculateEstimate} className="space-y-5">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-2 font-medium">
                    Built-Up Area (Sq. Ft.)
                  </label>
                  <input
                    type="number"
                    value={estimatorInput.builtUpArea}
                    onChange={(e) => setEstimatorInput({ ...estimatorInput, builtUpArea: Number(e.target.value) })}
                    min={500}
                    max={50000}
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4A300]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-2 font-medium">
                    Construction Quality Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['standard', 'premium', 'luxury'] as const).map((tier) => (
                      <button
                        type="button"
                        key={tier}
                        onClick={() => setEstimatorInput({ ...estimatorInput, packageType: tier })}
                        className={`py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold capitalize border transition-all ${
                          estimatorInput.packageType === tier
                            ? 'bg-[#0B3C5D] border-[#F4A300] text-[#F4A300]'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-2 font-medium">
                      Location / City
                    </label>
                    <select
                      value={estimatorInput.city}
                      onChange={(e) => setEstimatorInput({ ...estimatorInput, city: e.target.value })}
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-[#F4A300]"
                    >
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Pune">Pune</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-2 font-medium">
                      Floors
                    </label>
                    <input
                      type="number"
                      value={estimatorInput.floors}
                      onChange={(e) => setEstimatorInput({ ...estimatorInput, floors: Number(e.target.value) })}
                      min={1}
                      max={6}
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F4A300]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={calculating}
                  className="w-full py-3.5 bg-[#F4A300] text-black font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-[#e09400] transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  {calculating ? 'Computing...' : 'Calculate Construction Quote'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-[#141414] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between">
              {estimateResult ? (
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#F4A300] font-semibold block mb-2">
                    Verified Estimate Report
                  </span>
                  <div className="flex items-baseline gap-4 mb-6">
                    <span className="text-4xl font-serif font-bold text-white">
                      ₹{estimateResult.totalEstimatedCost.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-400">
                      (₹{estimateResult.ratePerSqFt}/sq.ft for {estimateResult.builtUpArea} sq.ft)
                    </span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div>
                      <div className="flex justify-between text-xs text-gray-300 mb-1">
                        <span>Civil & Structural Frame (48%)</span>
                        <span className="font-mono text-white">₹{estimateResult.breakdown.civilStructureCost.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#0B3C5D] h-full w-[48%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-gray-300 mb-1">
                        <span>Finishing, Flooring & Interiors (28%)</span>
                        <span className="font-mono text-white">₹{estimateResult.breakdown.finishingAndInteriors.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#F4A300] h-full w-[28%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-gray-300 mb-1">
                        <span>Plumbing, Sanitation & MEP (14%)</span>
                        <span className="font-mono text-white">₹{estimateResult.breakdown.plumbingAndElectrical.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[14%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-gray-300 mb-1">
                        <span>Architecture, Vastu & 310+ QA Gates (10%)</span>
                        <span className="font-mono text-white">₹{estimateResult.breakdown.architecturalAndQA.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full w-[10%]" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-500">Timeline SLA</div>
                      <div className="text-base font-serif font-bold text-white mt-1">
                        ~{estimateResult.estimatedDurationMonths} Months Handover
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-500">Escrow Security</div>
                      <div className="text-base font-serif font-bold text-[#F4A300] mt-1">
                        100% Milestone Safe
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center text-gray-500">
                  <Calculator size={48} className="mb-4 opacity-20" />
                  <p className="text-sm">Click "Calculate Construction Quote" to view structural breakdown.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-serif font-bold text-white">Portfolio Showcase Database</h2>
              <span className="text-xs text-gray-400">{projects.length} Registered Structures</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <div key={p.id} className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5">
                  <div className="h-44 overflow-hidden relative">
                    <img src={p.heroImage || p.image} alt={p.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[10px] uppercase tracking-wider text-[#F4A300]">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif font-bold text-white text-base mb-1">{p.title}</h3>
                    <p className="text-gray-400 text-xs mb-3">{p.location} • {p.year}</p>
                    <Link
                      to={`/projects/${p.id}`}
                      target="_blank"
                      className="text-xs text-[#F4A300] hover:underline flex items-center gap-1 font-medium"
                    >
                      View Live Page <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

