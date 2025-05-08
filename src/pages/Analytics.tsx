import React, { useState, useEffect } from 'react';
import { 
  ChartPie, TrendingUp, ArrowUpRight, ChartBar, ChartLine, Calendar,
  DollarSign, AlertTriangle, Lightbulb
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend 
} from 'recharts';

import GlassCard from '@/components/GlassCard';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { usePipes, useSales, useRecommendations } from '@/lib/db-sqlite';

const Analytics = () => {
  const { pipes } = usePipes();
  const { 
    sales, 
    getTopSellingProducts,
    calculateTotalProfit,
    calculateTotalRevenue,
    getSalesByDateRange,
    getWeeklySales,
    getMonthlySales,
    getYearlySales,
  } = useSales();
  const { getPriceOptimizationRecommendations } = useRecommendations();
  
  const [timeRange, setTimeRange] = useState('month');
  const [filteredSales, setFilteredSales] = useState<any[]>([]);
  const [profitData, setProfitData] = useState<any[]>([]);
  const [pipeSalesByType, setPipeSalesByType] = useState<any[]>([]);
  const [marginAnalysis, setMarginAnalysis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProfit: 0,
    totalRevenue: 0,
    avgMargin: 0,
    profitTrend: {
      value: 0,
      isPositive: true
    },
    revenueTrend: {
      value: 0,
      isPositive: true
    },
    marginTrend: {
      value: 0,
      isPositive: true
    }
  });
  
  // Colors for charts
  const colors = ['#8B5CF6', '#6E59A5', '#10B981', '#F97316', '#EF4444', '#3b82f6'];
  
  // Price recommendations
  const priceRecommendations = getPriceOptimizationRecommendations();
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      let salesData;
      let dateLabels: string[] = [];
      
      try {
        // Fetch sales data based on selected time range
        switch (timeRange) {
          case 'week':
            salesData = await getWeeklySales();
            dateLabels = getLast7Days();
            break;
          case 'month':
            salesData = await getMonthlySales();
            dateLabels = getLast30Days();
            break;
          case 'year':
            salesData = await getYearlySales();
            dateLabels = getLast12Months();
            break;
          default:
            salesData = await getMonthlySales();
            dateLabels = getLast30Days();
        }
        
        setFilteredSales(salesData);
        
        // Calculate stats
        const totalProfit = calculateTotalProfit(salesData);
        const totalRevenue = calculateTotalRevenue(salesData);
        
        // Calculate average margin
        let totalMargin = 0;
        let itemCount = 0;
        
        salesData.forEach((sale: any) => {
          sale.items.forEach((item: any) => {
            const pipe = pipes.find(p => p.id === item.productId);
            if (pipe) {
              const margin = ((item.pricePerUnit - pipe.buyPrice) / pipe.buyPrice) * 100;
              totalMargin += margin;
              itemCount++;
            }
          });
        });
        
        const avgMargin = itemCount > 0 ? totalMargin / itemCount : 0;
        
        // Generate profit data
        const chartData = generateChartData(salesData, dateLabels);
        setProfitData(chartData);
        
        // Calculate trends (simulated for now)
        const profitTrend = {
          value: 15.3,
          isPositive: true
        };
        
        const marginTrend = {
          value: 3.8,
          isPositive: true
        };
        
        const revenueTrend = {
          value: 12.5,
          isPositive: true
        };
        
        setStats({
          totalProfit,
          totalRevenue,
          avgMargin,
          profitTrend,
          marginTrend,
          revenueTrend
        });
        
        // Generate sales by type
        const typeData = generateSalesByType(salesData);
        setPipeSalesByType(typeData);
        
        // Generate margin analysis
        const marginData = generateMarginAnalysis();
        setMarginAnalysis(marginData);
        
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [timeRange, pipes]);
  
  // Helper function to generate chart data based on date labels
  const generateChartData = (salesData: any[], labels: string[]) => {
    // Create a map to hold data by date
    const dataByDate = new Map();
    
    // Initialize with zero values
    labels.forEach(label => {
      dataByDate.set(label, {
        month: label,
        revenue: 0,
        expenses: 0,
        profit: 0
      });
    });
    
    // Populate with actual data
    salesData.forEach((sale: any) => {
      const date = new Date(sale.date);
      let label;
      
      if (timeRange === 'week') {
        label = date.toLocaleDateString('en-US', { weekday: 'short' });
      } else if (timeRange === 'month') {
        label = `${date.getDate()}-${date.toLocaleDateString('en-US', { month: 'short' })}`;
      } else {
        label = date.toLocaleDateString('en-US', { month: 'short' });
      }
      
      if (dataByDate.has(label)) {
        const entry = dataByDate.get(label);
        entry.revenue += sale.total;
        
        // Calculate expenses (total - profit)
        const expenses = sale.total - sale.profit;
        entry.expenses += expenses;
        entry.profit += sale.profit;
      }
    });
    
    // Convert map to array
    return Array.from(dataByDate.values());
  };
  
  // Helper function to generate sales by type
  const generateSalesByType = (salesData: any[]) => {
    const salesByType = new Map();
    
    salesData.forEach((sale: any) => {
      sale.items.forEach((item: any) => {
        const pipe = pipes.find(p => p.id === item.productId);
        if (pipe) {
          const type = pipe.type;
          const value = salesByType.get(type) || 0;
          salesByType.set(type, value + item.quantity);
        }
      });
    });
    
    // Convert map to array
    return Array.from(salesByType.entries()).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  // Helper function to generate margin analysis
  const generateMarginAnalysis = () => {
    return pipes.slice(0, 5).map(pipe => ({
      name: pipe.name,
      margin: Math.round(((pipe.sellPrice - pipe.buyPrice) / pipe.buyPrice) * 100),
      averagePrice: pipe.sellPrice
    }));
  };
  
  // Helper function to get last 7 days labels
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    return days;
  };
  
  // Helper function to get last 30 days labels
  const getLast30Days = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(`${date.getDate()}-${date.toLocaleDateString('en-US', { month: 'short' })}`);
    }
    return days;
  };
  
  // Helper function to get last 12 months labels
  const getLast12Months = () => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date.toLocaleDateString('en-US', { month: 'short' }));
    }
    return months;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profit & Loss Analysis</h1>
        
        <div className="flex gap-2 p-1 bg-eliva-card/60 rounded-lg">
          <button 
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              timeRange === 'week' ? "bg-eliva-accent text-white" : "text-muted-foreground hover:text-white"
            )}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              timeRange === 'month' ? "bg-eliva-accent text-white" : "text-muted-foreground hover:text-white"
            )}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              timeRange === 'year' ? "bg-eliva-accent text-white" : "text-muted-foreground hover:text-white"
            )}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Profit"
          value={`$${stats.totalProfit.toLocaleString()}`}
          icon={<DollarSign size={20} className="text-eliva-success" />}
          trend={stats.profitTrend}
        />
        
        <StatCard
          title="Average Margin"
          value={`${stats.avgMargin.toFixed(1)}%`}
          icon={<TrendingUp size={20} className="text-eliva-accent" />}
          trend={stats.marginTrend}
        />
        
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<ChartLine size={20} className="text-eliva-warning" />}
          trend={stats.revenueTrend}
        />
      </div>
      
      {loading ? (
        <GlassCard className="p-6 flex justify-center items-center h-80">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-eliva-accent/30 border-t-eliva-accent animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </GlassCard>
      ) : (
        <>
          {/* Main P&L Chart */}
          <GlassCard className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <ChartLine size={18} className="text-eliva-accent mr-2" />
                Revenue, Expenses & Profit
              </h3>
              <StatusBadge 
                status="info" 
                text={
                  timeRange === 'week' ? 'Last 7 Days' : 
                  timeRange === 'month' ? 'Last 30 Days' : 'Last 12 Months'
                } 
              />
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#6E59A5" />
                  <YAxis stroke="#6E59A5" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B', 
                      borderColor: '#334155',
                      color: '#fff' 
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Revenue"
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#8B5CF6', stroke: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    name="Expenses"
                    stroke="#F97316" 
                    strokeWidth={2}
                    dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#F97316', stroke: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    name="Profit"
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#10B981', stroke: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
          
          {/* Sales Distribution & Margin Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales by Product Type */}
            <GlassCard className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium flex items-center">
                  <ChartPie size={18} className="text-eliva-accent mr-2" />
                  Sales Distribution by Type
                </h3>
              </div>
              
              <div className="h-80 flex flex-col">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pipeSalesByType}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pipeSalesByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E293B', 
                          borderColor: '#334155',
                          color: '#fff' 
                        }} 
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {pipeSalesByType.map((type, index) => (
                    <div 
                      key={index}
                      className="p-2 rounded-lg text-center"
                      style={{ backgroundColor: `${colors[index % colors.length]}20` }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full mx-auto mb-1"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      ></div>
                      <p className="text-xs font-medium">{type.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
            
            {/* Margin Analysis */}
            <GlassCard className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium flex items-center">
                  <ChartBar size={18} className="text-eliva-warning mr-2" />
                  Profit Margin Analysis
                </h3>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={marginAnalysis}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} stroke="#6E59A5" />
                    <YAxis dataKey="name" type="category" stroke="#6E59A5" width={150} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1E293B', 
                        borderColor: '#334155',
                        color: '#fff' 
                      }}
                      formatter={(value: any) => [`${value}%`, 'Margin']}
                    />
                    <Bar 
                      dataKey="margin" 
                      fill="#6E59A5"
                      radius={[0, 4, 4, 0]}
                      label={{ 
                        position: 'right', 
                        formatter: (value: number) => `${value}%`,
                        fill: '#fff',
                        fontSize: 12
                      }}
                    >
                      {marginAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
          
          {/* AI Price Optimization */}
          <GlassCard className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <Lightbulb size={18} className="text-eliva-warning mr-2" />
                AI Price Optimization Recommendations
              </h3>
              <div className="flex items-center gap-2">
                <span className="bg-eliva-accent/20 text-eliva-accent text-xs py-1 px-2 rounded-full animate-pulse">
                  AI Powered
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="p-4 bg-eliva-highlight/30 rounded-lg border border-white/5">
                  <h4 className="text-sm font-medium mb-2">Projected Profit Impact</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Implementing these price optimizations could increase your overall profit margin by <span className="text-eliva-success font-bold">8.4%</span>, 
                    resulting in an estimated additional <span className="text-eliva-success font-bold">$2,914</span> in profit per month.
                  </p>
                  
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Current', profit: 34700 },
                          { name: 'Optimized', profit: 37614 }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#6E59A5" />
                        <YAxis stroke="#6E59A5" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1E293B', 
                            borderColor: '#334155',
                            color: '#fff' 
                          }}
                          formatter={(value: any) => [`$${value.toLocaleString()}`, 'Profit']}
                        />
                        <Bar 
                          dataKey="profit" 
                          radius={[4, 4, 0, 0]}
                        >
                          <Cell fill="#6E59A5" />
                          <Cell fill="#10B981" />
                        </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="p-4 bg-eliva-highlight/30 rounded-lg border border-white/5">
                  <h4 className="text-sm font-medium mb-4">Recommended Price Changes</h4>
                  
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-2 px-3 text-left font-medium text-muted-foreground">Product</th>
                        <th className="py-2 px-3 text-left font-medium text-muted-foreground">Current Price</th>
                        <th className="py-2 px-3 text-left font-medium text-muted-foreground">Suggested Price</th>
                        <th className="py-2 px-3 text-left font-medium text-muted-foreground">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceRecommendations.map((rec, index) => (
                        <tr key={index} className="border-b border-white/5">
                          <td className="py-2 px-3">
                            <div>
                              <p>{rec.productName}</p>
                              <p className="text-xs text-muted-foreground">{rec.reason}</p>
                            </div>
                          </td>
                          <td className="py-2 px-3 font-mono">${rec.currentPrice}</td>
                          <td className="py-2 px-3 font-mono">${rec.suggestedPrice}</td>
                          <td className="py-2 px-3">
                            <StatusBadge 
                              status={rec.type === 'price-increase' ? 'success' : 'warning'} 
                              text={`${rec.type === 'price-increase' ? '+' : '-'}${Math.abs(rec.suggestedPrice - rec.currentPrice)}`} 
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-eliva-highlight/30 rounded-lg border border-white/5">
                  <h4 className="text-sm font-medium mb-2">Margin Optimization</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Current average margin: <span className="font-medium">58.2%</span>
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Optimized average margin: <span className="text-eliva-success font-bold">62.8%</span>
                  </p>
                  
                  <div className="h-4 bg-eliva-card rounded-full overflow-hidden">
                    <div 
                      className="h-4 bg-gradient-to-r from-eliva-purple to-eliva-accent"
                      style={{ width: '62.8%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div className="p-4 bg-eliva-highlight/30 rounded-lg border border-white/5">
                  <h4 className="text-sm font-medium mb-2">Implementation Strategy</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-eliva-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-eliva-accent">1</span>
                      </div>
                      <span>Gradually implement price increases for top-selling items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-eliva-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-eliva-accent">2</span>
                      </div>
                      <span>Run promotions on low-performing items with decreased prices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-eliva-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-eliva-accent">3</span>
                      </div>
                      <span>Bundle slow-moving products with popular items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-eliva-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-eliva-accent">4</span>
                      </div>
                      <span>Monitor customer response to price changes and adjust accordingly</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 bg-eliva-highlight/30 rounded-lg border border-white/5">
                  <h4 className="text-sm font-medium mb-2">Risk Assessment</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs">Sales Volume Impact</span>
                        <StatusBadge status="warning" text="Medium" />
                      </div>
                      <div className="h-1.5 bg-eliva-card rounded-full overflow-hidden">
                        <div className="h-1.5 bg-eliva-warning" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs">Customer Retention</span>
                        <StatusBadge status="success" text="Low" />
                      </div>
                      <div className="h-1.5 bg-eliva-card rounded-full overflow-hidden">
                        <div className="h-1.5 bg-eliva-success" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs">Competitive Response</span>
                        <StatusBadge status="info" text="Low" />
                      </div>
                      <div className="h-1.5 bg-eliva-card rounded-full overflow-hidden">
                        <div className="h-1.5 bg-blue-500" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
};

// Helper function for className conditionals
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default Analytics;
