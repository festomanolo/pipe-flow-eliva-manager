
import React, { useState } from 'react';
import { 
  ShoppingBag, DollarSign, TrendingUp, AlertTriangle, Package, 
  ArrowUpRight, ChartPie, ChartBar, ChartLine 
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import GlassCard from '@/components/GlassCard';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { usePipes, useSales, useRecommendations } from '@/lib/db';

const Dashboard = () => {
  const { pipes, getLowStockPipes } = usePipes();
  const { 
    sales, 
    getTodaySales, 
    getMonthlySales,
    getTopSellingProducts,
    getLowPerformingProducts,
    calculateTotalProfit
  } = useSales();
  const { getPriceOptimizationRecommendations, getInventoryRecommendations } = useRecommendations();

  const todaySales = getTodaySales();
  const monthlySales = getMonthlySales();
  const lowStockItems = getLowStockPipes();
  const topProducts = getTopSellingProducts();
  const lowPerformingProducts = getLowPerformingProducts();
  const priceRecommendations = getPriceOptimizationRecommendations();
  const inventoryRecommendations = getInventoryRecommendations();
  
  // Calculate stats
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const todayProfit = todaySales.reduce((sum, sale) => sum + sale.profit, 0);
  const totalProfit = calculateTotalProfit();
  const totalInventoryValue = pipes.reduce((sum, pipe) => sum + (pipe.stock * pipe.buyPrice), 0);
  
  // Colors for charts
  const colors = ['#8B5CF6', '#6E59A5', '#10B981', '#F97316', '#EF4444'];

  // Generate data for charts
  const pieChartData = topProducts.slice(0, 5).map((item, index) => ({
    name: item.product?.name || 'Unknown',
    value: item.totalQuantity,
    color: colors[index % colors.length]
  }));

  // Mock data for sales over time
  const salesData = [
    { name: 'Mon', sales: 10, value: 400 },
    { name: 'Tue', sales: 15, value: 600 },
    { name: 'Wed', sales: 8, value: 320 },
    { name: 'Thu', sales: 20, value: 800 },
    { name: 'Fri', sales: 12, value: 480 },
    { name: 'Sat', sales: 18, value: 720 },
    { name: 'Sun', sales: 5, value: 200 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Sales"
          value={`$${todayRevenue.toFixed(2)}`}
          icon={<ShoppingBag size={20} className="text-eliva-accent" />}
          trend={{ value: 12, isPositive: true }}
        />
        
        <StatCard
          title="Today's Profit"
          value={`$${todayProfit.toFixed(2)}`}
          icon={<DollarSign size={20} className="text-eliva-success" />}
          trend={{ value: 8, isPositive: true }}
        />
        
        <StatCard
          title="Total Profit"
          value={`$${totalProfit.toFixed(2)}`}
          icon={<TrendingUp size={20} className="text-eliva-accent" />}
        />
        
        <StatCard
          title="Inventory Value"
          value={`$${totalInventoryValue.toFixed(2)}`}
          icon={<Package size={20} className="text-eliva-warning" />}
        />
      </div>
      
      {/* Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <GlassCard className="lg:col-span-2 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Sales Performance</h3>
            <div>
              <StatusBadge status="info" text="This Week" />
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <XAxis dataKey="name" stroke="#6E59A5" />
                <YAxis stroke="#6E59A5" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    borderColor: '#334155',
                    color: '#fff' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#8B5CF6', stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        
        {/* Top Selling Products */}
        <GlassCard className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Top Selling Products</h3>
            <ChartPie size={18} className="text-eliva-accent" />
          </div>
          
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    borderColor: '#334155',
                    color: '#fff' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
      
      {/* Low Stock Items and AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Items */}
        <GlassCard className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Low Stock Items</h3>
            <StatusBadge 
              status={lowStockItems.length > 0 ? "danger" : "success"} 
              text={lowStockItems.length > 0 ? `${lowStockItems.length} Items` : "All Stocked"} 
              animated={lowStockItems.length > 0}
            />
          </div>
          
          {lowStockItems.length > 0 ? (
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-eliva-highlight/30 rounded-lg border border-white/5">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.type} - {item.diameter}mm - {item.color}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-eliva-danger font-bold">{item.stock} left</p>
                    <p className="text-xs text-muted-foreground">Min: {item.minStock}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Package size={48} className="text-muted-foreground mb-4 opacity-30" />
              <p className="text-muted-foreground">All items are properly stocked</p>
            </div>
          )}
        </GlassCard>
        
        {/* AI Recommendations */}
        <GlassCard className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">AI Recommendations</h3>
            <div className="flex items-center gap-2">
              <span className="bg-eliva-accent/20 text-eliva-accent text-xs py-1 px-2 rounded-full animate-pulse">
                AI Powered
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Price Optimization */}
            {priceRecommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-eliva-accent">Price Optimization</h4>
                {priceRecommendations.slice(0, 2).map((rec, index) => (
                  <div key={index} className="p-2 bg-eliva-highlight/30 rounded-lg border border-white/5">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">{rec.productName}</p>
                      <StatusBadge 
                        status={rec.type === 'price-increase' ? 'success' : 'warning'} 
                        text={rec.type === 'price-increase' ? 'Increase' : 'Decrease'} 
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                    <div className="flex justify-between items-center mt-2 text-xs">
                      <span>Current: ${rec.currentPrice}</span>
                      <span className="font-bold text-eliva-accent">Suggested: ${rec.suggestedPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Inventory Recommendations */}
            {inventoryRecommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-eliva-warning">Inventory Insights</h4>
                {inventoryRecommendations.slice(0, 2).map((rec, index) => (
                  <div key={index} className="p-2 bg-eliva-highlight/30 rounded-lg border border-white/5">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">{rec.productName}</p>
                      <StatusBadge status="warning" text="Overstock" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                    <div className="flex justify-between items-center mt-2 text-xs">
                      <span>Current: {rec.currentStock} units</span>
                      <span>Min: {rec.minStock} units</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {priceRecommendations.length === 0 && inventoryRecommendations.length === 0 && (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <TrendingUp size={48} className="text-muted-foreground mb-4 opacity-30" />
                <p className="text-muted-foreground">No recommendations at this time</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
      
      {/* Hot Sales vs Low Performing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hot Sales */}
        <GlassCard className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Hot Sales</h3>
            <ArrowUpRight size={18} className="text-eliva-success" />
          </div>
          
          <div className="space-y-3">
            {topProducts.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-eliva-highlight/30 rounded-lg border border-white/5">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-eliva-purple/20 flex items-center justify-center text-eliva-accent mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.product?.type} - {item.product?.diameter}mm
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{item.totalQuantity} sold</p>
                  <p className="text-xs text-eliva-success">${item.totalProfit.toFixed(2)} profit</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        
        {/* Low Performing */}
        <GlassCard className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Low Performing Items</h3>
            <ChartBar size={18} className="text-eliva-warning" />
          </div>
          
          <div className="space-y-3">
            {lowPerformingProducts.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-eliva-highlight/30 rounded-lg border border-white/5">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-eliva-warning/20 flex items-center justify-center text-eliva-warning mr-3">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.product?.type} - {item.product?.diameter}mm
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{item.totalQuantity} sold</p>
                  <p className="text-xs text-eliva-warning">${item.totalProfit.toFixed(2)} profit</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Performance Comparison Chart */}
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lowPerformingProducts.slice(0, 3).map(item => ({
                  name: item.product?.name || 'Unknown',
                  sales: item.totalQuantity,
                  profit: item.totalProfit
                }))}
              >
                <XAxis dataKey="name" stroke="#6E59A5" />
                <YAxis stroke="#6E59A5" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    borderColor: '#334155',
                    color: '#fff' 
                  }} 
                />
                <Bar dataKey="sales" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
      
      {/* Profit and Loss Analysis */}
      <GlassCard className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Profit and Loss Analysis</h3>
          <ChartLine size={18} className="text-eliva-accent" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { name: 'Week 1', revenue: 2400, expenses: 1800, profit: 600 },
                    { name: 'Week 2', revenue: 1600, expenses: 1200, profit: 400 },
                    { name: 'Week 3', revenue: 3200, expenses: 2100, profit: 1100 },
                    { name: 'Week 4', revenue: 2800, expenses: 1900, profit: 900 },
                  ]}
                >
                  <XAxis dataKey="name" stroke="#6E59A5" />
                  <YAxis stroke="#6E59A5" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B', 
                      borderColor: '#334155',
                      color: '#fff' 
                    }} 
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#F97316" strokeWidth={2} />
                  <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-3 bg-eliva-highlight/30 rounded-lg border border-white/5">
              <h4 className="text-sm font-medium mb-2">Profit Margin</h4>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-eliva-success">38.2%</p>
                <StatusBadge status="success" text="+5.4% vs last month" />
              </div>
            </div>
            
            <div className="p-3 bg-eliva-highlight/30 rounded-lg border border-white/5">
              <h4 className="text-sm font-medium mb-2">Monthly Revenue</h4>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-eliva-accent">$10,240</p>
                <StatusBadge status="info" text="+12.1% growth" />
              </div>
            </div>
            
            <div className="p-3 bg-eliva-highlight/30 rounded-lg border border-white/5">
              <h4 className="text-sm font-medium mb-2">AI Price Optimization</h4>
              <p className="text-sm text-muted-foreground">Potential profit increase of 8.4% by optimizing prices on 5 products</p>
              <button className="mt-2 bg-eliva-accent/20 text-eliva-accent text-xs py-1 px-3 rounded-full w-full">
                View Details
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Dashboard;
