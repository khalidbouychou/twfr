// import React, { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { 
//   DashboardCard, 
//   AnimatedSidebar, 
//   NavItem, 
//   AnimatedModal,
//   AnimatedChart,
//   AnimatedHeader,
//   InvestmentCard,
//   PageContainer,
//   StaggeredContainer,
//   StaggeredItem,
//   Button,
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   Badge
// } from "../ui"
// import { formatCurrency, formatPercentage } from "../../lib/utils"

// // Icons
// const Icons = {
//   Dashboard: (props) => (
//     <svg {...props} fill="currentColor" viewBox="0 0 20 20">
//       <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
//       <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
//     </svg>
//   ),
//   Portfolio: (props) => (
//     <svg {...props} fill="currentColor" viewBox="0 0 20 20">
//       <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
//     </svg>
//   ),
//   Investments: (props) => (
//     <svg {...props} fill="currentColor" viewBox="0 0 20 20">
//       <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-.89l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
//     </svg>
//   ),
//   Simulations: (props) => (
//     <svg {...props} fill="currentColor" viewBox="0 0 20 20">
//       <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z" />
//       <path d="M3 5a2 2 0 012-2h1V1a1 1 0 112 0v1h1a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM3 11a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4z" />
//     </svg>
//   ),
//   News: (props) => (
//     <svg {...props} fill="currentColor" viewBox="0 0 20 20">
//       <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
//     </svg>
//   ),
//   Wallet: (props) => (
//     <svg {...props} fill="currentColor" viewBox="0 0 20 20">
//       <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//     </svg>
//   ),
//   TrendingUp: (props) => (
//     <svg {...props} fill="currentColor" viewBox="0 0 20 20">
//       <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L12 7z" clipRule="evenodd" />
//     </svg>
//   ),
//   Users: (props) => (
//     <svg {...props} fill="currentColor" viewBox="0 0 20 20">
//       <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
//     </svg>
//   ),
//   Chart: (props) => (
//     <svg {...props} fill="currentColor" viewBox="0 0 20 20">
//       <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
//     </svg>
//   )
// }

// const ModernDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [currentPage, setCurrentPage] = useState("dashboard")
//   const [showBalanceModal, setShowBalanceModal] = useState(false)
//   const [userBalance, setUserBalance] = useState(25000)
//   const [portfolioData, setPortfolioData] = useState({
//     totalInvested: 15000,
//     globalPerformance: 12.5,
//     dailyVariation: 2.3,
//     monthlyGrowth: 8.7,
//     portfolioBreakdown: [
//       { name: "Actions Tech", value: 6000, color: "#3CD4AB" },
//       { name: "Obligations", value: 4000, color: "#89559F" },
//       { name: "Fonds Euro", value: 3000, color: "#FF6B6B" },
//       { name: "Immobilier", value: 2000, color: "#4ECDC4" }
//     ],
//     performanceHistory: [
//       { date: "Jan", value: 10000, label: "Jan" },
//       { date: "Fév", value: 11000, label: "Fév" },
//       { date: "Mar", value: 12000, label: "Mar" },
//       { date: "Avr", value: 12500, label: "Avr" },
//       { date: "Mai", value: 13500, label: "Mai" },
//       { date: "Juin", value: 15000, label: "Juin" }
//     ]
//   })

//   const navigationItems = [
//     { icon: Icons.Dashboard, label: "Dashboard", page: "dashboard" },
//     { icon: Icons.Portfolio, label: "Portefeuille", page: "portfolio" },
//     { icon: Icons.Investments, label: "Investissements", page: "investments" },
//     { icon: Icons.Simulations, label: "Simulations", page: "simulations" },
//     { icon: Icons.News, label: "Actualités", page: "news" }
//   ]

//   const mockInvestments = [
//     {
//       name: "Actions Tech Global",
//       risk: 7,
//       return: "15.2%",
//       min: 1000,
//       description: "Fonds d'actions technologiques internationales avec forte croissance",
//       image: "/assets/marketstock.png",
//       roi: {
//         annual: 15.2,
//         roi1Year: 15.2,
//         roi3Years: 52.1,
//         roi5Years: 102.3,
//         volatility: 8,
//         fees: 1.2
//       }
//     },
//     {
//       name: "Obligations d'État Maroc",
//       risk: 2,
//       return: "6.8%",
//       min: 500,
//       description: "Obligations gouvernementales à faible risque et rendement stable",
//       image: "/assets/OPCVM.jpg",
//       roi: {
//         annual: 6.8,
//         roi1Year: 6.8,
//         roi3Years: 21.8,
//         roi5Years: 39.1,
//         volatility: 2,
//         fees: 0.8
//       }
//     }
//   ]

//   const handleNavigation = (page) => {
//     setCurrentPage(page)
//     setSidebarOpen(false)
//   }

//   const handleAddBalance = () => {
//     setShowBalanceModal(true)
//   }

//   const handleWithdrawBalance = () => {
//     setShowBalanceModal(true)
//   }

//   const handleShowNotifications = () => {
//     // Handle notifications
//   }

//   const handleShowUserMenu = () => {
//     // Handle user menu
//   }

//   const handleInvest = (investment) => {
//     console.log("Investing in:", investment.name)
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       {/* Animated Header */}
//       <AnimatedHeader
//         userData={{ name: "KHALID", avatar: "https://cdn.intra.42.fr/users/74758a0eee89f55f72d656fc0645b523/khbouych.jpg" }}
//         userBalance={userBalance}
//         onAddBalance={handleAddBalance}
//         onWithdrawBalance={handleWithdrawBalance}
//         onShowNotifications={handleShowNotifications}
//         onShowUserMenu={handleShowUserMenu}
//         notifications={[]}
//         showNotifications={false}
//         showUserMenu={false}
//       />

//       {/* Animated Sidebar */}
//       <AnimatedSidebar
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         className="lg:translate-x-0"
//       >
//         <div className="space-y-2">
//           {navigationItems.map((item, index) => (
//             <NavItem
//               key={item.page}
//               icon={item.icon}
//               label={item.label}
//               isActive={currentPage === item.page}
//               onClick={() => handleNavigation(item.page)}
//               delay={index}
//             />
//           ))}
//         </div>
//       </AnimatedSidebar>

//       {/* Main Content */}
//       <div className="lg:ml-64 pt-20">
//         <div className="p-6">
//           <AnimatePresence mode="wait">
//             {currentPage === "dashboard" && (
//               <PageContainer key="dashboard">
//                 <StaggeredContainer>
//                   {/* Page Header */}
//                   <StaggeredItem>
//                     <div className="mb-8">
//                       <motion.h1 
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
//                       >
//                         Dashboard
//                       </motion.h1>
//                       <p className="text-muted-foreground text-lg">
//                         Vue d'ensemble de votre portefeuille d'investissement
//                       </p>
//                     </div>
//                   </StaggeredItem>

//                   {/* Summary Cards */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     <StaggeredItem>
//                       <DashboardCard
//                         title="Solde Disponible"
//                         value={formatCurrency(userBalance)}
//                         subtitle="Fonds disponibles pour investir"
//                         icon={Icons.Wallet}
//                         trend="up"
//                         trendValue="+2.5%"
//                         delay={0}
//                       />
//                     </StaggeredItem>

//                     <StaggeredItem>
//                       <DashboardCard
//                         title="Total Investi"
//                         value={formatCurrency(portfolioData.totalInvested)}
//                         subtitle="Capital total investi"
//                         icon={Icons.Chart}
//                         trend="up"
//                         trendValue="+8.7%"
//                         delay={1}
//                       />
//                     </StaggeredItem>

//                     <StaggeredItem>
//                       <DashboardCard
//                         title="Performance Globale"
//                         value={formatPercentage(portfolioData.globalPerformance)}
//                         subtitle="Rendement total du portefeuille"
//                         icon={Icons.TrendingUp}
//                         trend="up"
//                         trendValue="+2.3%"
//                         delay={2}
//                       />
//                     </StaggeredItem>

//                     <StaggeredItem>
//                       <DashboardCard
//                         title="Croissance Mensuelle"
//                         value={formatPercentage(portfolioData.monthlyGrowth)}
//                         subtitle="Évolution sur 30 jours"
//                         icon={Icons.Users}
//                         trend="up"
//                         trendValue="+1.8%"
//                         delay={3}
//                       />
//                     </StaggeredItem>
//                   </div>

//                   {/* Charts and Portfolio */}
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//                     <StaggeredItem>
//                       <Card className="h-80">
//                         <CardHeader>
//                           <CardTitle>Évolution du Portefeuille</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <AnimatedChart
//                             data={portfolioData.performanceHistory}
//                             type="area"
//                             height={250}
//                           />
//                         </CardContent>
//                       </Card>
//                     </StaggeredItem>

//                     <StaggeredItem>
//                       <Card className="h-80">
//                         <CardHeader>
//                           <CardTitle>Répartition du Portefeuille</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="space-y-4">
//                             {portfolioData.portfolioBreakdown.map((item, index) => (
//                               <motion.div
//                                 key={item.name}
//                                 initial={{ opacity: 0, x: -20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ delay: index * 0.1 }}
//                                 className="flex items-center justify-between"
//                               >
//                                 <div className="flex items-center space-x-3">
//                                   <div 
//                                     className="w-4 h-4 rounded-full"
//                                     style={{ backgroundColor: item.color }}
//                                   />
//                                   <span className="font-medium">{item.name}</span>
//                                 </div>
//                                 <div className="text-right">
//                                   <div className="font-semibold">{formatCurrency(item.value)}</div>
//                                   <div className="text-sm text-muted-foreground">
//                                     {Math.round((item.value / portfolioData.totalInvested) * 100)}%
//                                   </div>
//                                 </div>
//                               </motion.div>
//                             ))}
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </StaggeredItem>
//                   </div>

//                   {/* Investment Opportunities */}
//                   <StaggeredItem>
//                     <Card>
//                       <CardHeader>
//                         <CardTitle>Opportunités d'Investissement</CardTitle>
//                         <p className="text-muted-foreground">
//                           Produits recommandés selon votre profil
//                         </p>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                           {mockInvestments.map((investment, index) => (
//                             <InvestmentCard
//                               key={investment.name}
//                               investment={investment}
//                               onInvest={handleInvest}
//                               delay={index}
//                             />
//                           ))}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </StaggeredItem>
//                 </StaggeredContainer>
//               </PageContainer>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>

//       {/* Balance Modal */}
//       <AnimatedModal
//         isOpen={showBalanceModal}
//         onClose={() => setShowBalanceModal(false)}
//         title="Gérer le Solde"
//         size="sm"
//       >
//         <div className="space-y-4">
//           <div className="text-center">
//             <p className="text-muted-foreground mb-2">Solde actuel</p>
//             <p className="text-3xl font-bold text-primary">
//               {formatCurrency(userBalance)}
//             </p>
//           </div>
          
//           <div className="grid grid-cols-2 gap-3">
//             <Button variant="default" className="w-full">
//               Ajouter des Fonds
//             </Button>
//             <Button variant="outline" className="w-full">
//               Retirer des Fonds
//             </Button>
//           </div>
//         </div>
//       </AnimatedModal>
//     </div>
//   )
// }

// export default ModernDashboard 