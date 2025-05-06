
import React, { useState } from 'react';
import { 
  FileText, Download, Calendar, ChevronDown, Filter, Printer,
  FileBarChart, FilePieChart, FileLineChart, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

import GlassCard from '@/components/GlassCard';
import StatusBadge from '@/components/StatusBadge';
import { generateDailyReport, savePdf } from '@/lib/pdfGenerator';
import { useSales, usePipes } from '@/lib/db';

const Reports = () => {
  const { sales, getTodaySales, getTopSellingProducts } = useSales();
  const { pipes } = usePipes();
  
  const [reportType, setReportType] = useState('daily');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };
  
  const handleGenerateReport = async () => {
    const todaySales = getTodaySales();
    const topProducts = getTopSellingProducts().slice(0, 5).map(item => ({
      product: item.product!,
      quantitySold: item.totalQuantity,
      revenue: item.totalQuantity * (item.product?.sellPrice || 0),
    }));
    
    const totalRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const totalProfit = todaySales.reduce((sum, sale) => sum + sale.profit, 0);
    
    const pdfPath = await generateDailyReport({
      date: new Date(),
      sales: todaySales,
      totalRevenue,
      totalProfit,
      topProducts,
    });
    
    savePdf(pdfPath);
  };
  
  // Sample reports data
  const recentReports = [
    {
      id: '1',
      name: 'Daily Sales Report',
      date: '2023-05-05',
      type: 'daily',
      status: 'ready',
    },
    {
      id: '2',
      name: 'Inventory Status Report',
      date: '2023-05-04',
      type: 'inventory',
      status: 'ready',
    },
    {
      id: '3',
      name: 'Monthly Sales Analysis',
      date: '2023-05-01',
      type: 'monthly',
      status: 'ready',
    },
    {
      id: '4',
      name: 'Profit and Loss Summary',
      date: '2023-04-30',
      type: 'financial',
      status: 'ready',
    },
    {
      id: '5',
      name: 'Low Stock Alert Report',
      date: '2023-04-29',
      type: 'inventory',
      status: 'ready',
    },
  ];
  
  // Report templates
  const reportTemplates = [
    {
      id: 'daily',
      name: 'Daily Sales Report',
      description: 'Summary of all sales transactions for a specific day',
      icon: <FileText size={36} className="text-eliva-accent" />,
    },
    {
      id: 'inventory',
      name: 'Inventory Status Report',
      description: 'Current stock levels, low stock alerts, and restocking needs',
      icon: <FileBarChart size={36} className="text-eliva-warning" />,
    },
    {
      id: 'sales',
      name: 'Sales Performance Analysis',
      description: 'Detailed analysis of sales trends across products and time periods',
      icon: <FilePieChart size={36} className="text-eliva-success" />,
    },
    {
      id: 'financial',
      name: 'Financial Summary',
      description: 'Profit and loss statement, revenue breakdown, and margin analysis',
      icon: <FileLineChart size={36} className="text-eliva-purple" />,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>
      
      {/* Report Generator */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold mb-4">Generate Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Report Type</label>
            <div className="relative">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full p-2 pl-10 bg-eliva-card/60 border border-white/10 rounded-lg appearance-none"
              >
                <option value="daily">Daily Sales Report</option>
                <option value="inventory">Inventory Status Report</option>
                <option value="sales">Sales Performance Analysis</option>
                <option value="financial">Financial Summary</option>
              </select>
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            </div>
          </div>
          
          {/* Date Range */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="start"
                  value={dateRange.start}
                  onChange={handleDateChange}
                  className="w-full p-2 pl-10 bg-eliva-card/60 border border-white/10 rounded-lg"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">End Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="end"
                  value={dateRange.end}
                  onChange={handleDateChange}
                  className="w-full p-2 pl-10 bg-eliva-card/60 border border-white/10 rounded-lg"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            className="glass-button flex items-center justify-center"
            onClick={handleGenerateReport}
          >
            <Download size={18} className="mr-2" />
            Generate Report
          </button>
        </div>
      </GlassCard>
      
      {/* Report Templates */}
      <div>
        <h2 className="text-xl font-bold mb-4">Report Templates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportTemplates.map(template => (
            <GlassCard 
              key={template.id} 
              className="p-5 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setReportType(template.id)}
            >
              <div className="flex flex-col items-center text-center h-full">
                {template.icon}
                <h3 className="font-medium text-lg mt-4">{template.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{template.description}</p>
                <button 
                  className="mt-auto pt-4 text-eliva-accent text-sm hover:underline flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReportType(template.id);
                    handleGenerateReport();
                  }}
                >
                  <Download size={14} className="mr-1" />
                  Generate Report
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
      
      {/* Recent Reports */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Reports</h2>
        
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-eliva-card/80">
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Report Name</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Date</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Type</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Status</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr 
                    key={report.id}
                    className="border-b border-white/10 hover:bg-eliva-highlight/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-eliva-purple/20 flex items-center justify-center">
                          <FileText size={16} className="text-eliva-accent" />
                        </div>
                        <span className="font-medium">{report.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{report.date}</td>
                    <td className="py-3 px-4">
                      <StatusBadge 
                        status={
                          report.type === 'daily' ? 'info' :
                          report.type === 'inventory' ? 'warning' :
                          report.type === 'monthly' ? 'success' : 'neutral'
                        } 
                        text={report.type}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-muted-foreground" />
                        <span>Generated 2 hours ago</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-1.5 rounded-md bg-eliva-accent/20 text-eliva-accent hover:bg-eliva-accent/30 transition-colors"
                          title="Download Report"
                        >
                          <Download size={16} />
                        </button>
                        <button 
                          className="p-1.5 rounded-md bg-eliva-highlight/50 text-white hover:bg-eliva-highlight/80 transition-colors"
                          title="Print Report"
                        >
                          <Printer size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Reports;
