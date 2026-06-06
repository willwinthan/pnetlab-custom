import React, { useState } from "react"
import { 
  Plus, 
  Settings, 
  FileText, 
  RefreshCw, 
  ChevronDown, 
  ChevronRight, 
  Image as ImageIcon, 
  BarChart2, 
  BookOpen, 
  LogOut, 
  Power, 
  Trash2, 
  ShieldAlert, 
  Layout, 
  FolderOpen
} from "lucide-react"
import Member from "../lab/members/Members"

export default function UnifiedSidebar() {
  const [openSections, setOpenSections] = useState({
    tools: true,
    automation: true,
    controls: false
  })

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Get active logo URL if available from global server config
  const logoUrl = (window.server && window.server.common && window.server.common.APP_LOGO) || "/store/public/assets/auth/img/logo.png"

  return (
    <aside className="w-64 h-full bg-[#071124]/90 backdrop-blur-lg border-r border-slate-800/80 flex flex-col text-slate-200 select-none z-40 shrink-0">
      {/* 1. Logo Section */}
      <div className="p-6 border-b border-slate-800/50 flex items-center justify-center bg-slate-950/20">
        <img 
          src={logoUrl} 
          alt="Logo" 
          className="max-h-12 w-auto object-contain transition-transform duration-300 hover:scale-105" 
        />
      </div>

      {/* 2. Scrollable Navigation List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {/* Main Actions Group */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
          
          <a className="action-labobjectadd cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition-all group border border-transparent hover:border-slate-800/30">
            <Plus className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Add an Object</span>
          </a>

          <a className="action-moreactions cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition-all group border border-transparent hover:border-slate-800/30">
            <Settings className="h-4 w-4 text-indigo-400 group-hover:rotate-45 transition-transform" />
            <span className="text-sm font-medium">Setup Nodes</span>
          </a>

          <a className="action-configsget cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition-all group border border-transparent hover:border-slate-800/30">
            <FileText className="h-4 w-4 text-emerald-400 group-hover:translate-y-[-1px] transition-transform" />
            <span className="text-sm font-medium">Startup Configs</span>
          </a>

          <a className="action-labtopologyrefresh cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition-all group border border-transparent hover:border-slate-800/30">
            <RefreshCw className="h-4 w-4 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-sm font-medium">Refresh Topology</span>
          </a>
        </div>

        {/* Collapsible Lab Tools Section */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleSection("tools")}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
          >
            <span>Lab Tools</span>
            {openSections.tools ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
          
          {openSections.tools && (
            <div className="mt-1 pl-1 space-y-1 animate-in fade-in duration-200">
              {/* Dynamic Lock/Unlock Hook Placeholder */}
              <div id="action_lock_lab" className="w-full" />

              <a className="action-editbackground cursor-pointer flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 transition-colors text-sm">
                <Layout className="h-4 w-4 text-purple-400" />
                <span>Background</span>
              </a>

              <a className="action-picturesget cursor-pointer flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 transition-colors text-sm">
                <ImageIcon className="h-4 w-4 text-blue-400" />
                <span>Pictures</span>
              </a>

              <a className="action-systemstatus cursor-pointer flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 transition-colors text-sm">
                <BarChart2 className="h-4 w-4 text-rose-400" />
                <span>System Status</span>
              </a>
            </div>
          )}
        </div>

        {/* Collapsible Automation & Docs Section */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleSection("automation")}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
          >
            <span>Automation & Docs</span>
            {openSections.automation ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>

          {openSections.automation && (
            <div className="mt-1 pl-1 space-y-1 animate-in fade-in duration-200">
              <a className="lab_workbook cursor-pointer flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 transition-colors text-sm">
                <BookOpen className="h-4 w-4 text-orange-400" />
                <span>Workbook Editor</span>
              </a>

              {/* Dynamic Console Switch Mountpoint */}
              <div id="action_change_console" className="px-3 py-1" />
            </div>
          )}
        </div>

        {/* Collapsible Danger Zone / Controls Section */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleSection("controls")}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
          >
            <span>Controls</span>
            {openSections.controls ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>

          {openSections.controls && (
            <div className="mt-1 pl-1 space-y-1 animate-in fade-in duration-200">
              <a className="action-labclose cursor-pointer flex items-center gap-3 px-3 py-2 rounded-md hover:bg-rose-950/20 text-slate-400 hover:text-rose-200 transition-colors text-sm">
                <Power className="h-4 w-4 text-yellow-500" />
                <span>Close Lab</span>
              </a>

              <a className="action-labdestroy cursor-pointer flex items-center gap-3 px-3 py-2 rounded-md hover:bg-rose-950/40 text-slate-400 hover:text-rose-100 transition-colors text-sm">
                <Trash2 className="h-4 w-4 text-rose-500" />
                <span>Destroy Lab</span>
              </a>
            </div>
          )}
        </div>

        {/* Active Lab Members Panel */}
        <div className="pt-4 border-t border-slate-800/40">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <FolderOpen className="h-3 w-3" />
            <span>Active Users</span>
          </p>
          <div className="px-3 py-1 text-slate-400 text-sm">
            <Member />
          </div>
        </div>
      </div>

      {/* 3. Footer Area */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-950/40 flex flex-col gap-2">
        <a className="action-logout cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800/50 hover:bg-rose-950/40 border border-slate-700/30 hover:border-rose-900/30 text-slate-300 hover:text-rose-200 transition-all font-medium text-sm">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  )
}
